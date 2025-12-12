import jsPDF from 'jspdf';
import { TranscriptionResult } from '../types';

export const generatePDF = async (
    transcription: TranscriptionResult,
    image: File
): Promise<void> => {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 15;
    const contentWidth = pageWidth - 2 * margin;
    let yPosition = margin;

    // Helper function to add new page if needed
    const checkPageBreak = (neededSpace: number) => {
        if (yPosition + neededSpace > pageHeight - margin) {
            pdf.addPage();
            yPosition = margin;
            return true;
        }
        return false;
    };

    // Header
    pdf.setFillColor(45, 45, 45);
    pdf.rect(0, 0, pageWidth, 40, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(24);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Kurrent-Transkription', margin, 20);
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    const date = new Date().toLocaleDateString('de-AT', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    pdf.text(date, margin, 30);
    yPosition = 50;

    // Add image with correct aspect ratio (NOT distorted!)
    const reader = new FileReader();
    await new Promise<void>((resolve) => {
        reader.onload = (e) => {
            if (e.target?.result) {
                const imgData = e.target.result as string;
                const tempImg = new Image();
                tempImg.onload = () => {
                    // Calculate aspect ratio
                    const aspectRatio = tempImg.width / tempImg.height;
                    const maxImageWidth = contentWidth;
                    const maxImageHeight = 180; // Max height for image

                    let imgWidth = maxImageWidth;
                    let imgHeight = imgWidth / aspectRatio;

                    // If height exceeds max, scale down
                    if (imgHeight > maxImageHeight) {
                        imgHeight = maxImageHeight;
                        imgWidth = imgHeight * aspectRatio;
                    }

                    // Center image horizontally
                    const xPosition = margin + (contentWidth - imgWidth) / 2;

                    checkPageBreak(imgHeight + 10);

                    try {
                        pdf.addImage(
                            imgData,
                            'JPEG',
                            xPosition,
                            yPosition,
                            imgWidth,
                            imgHeight,
                            undefined,
                            'FAST'
                        );
                        yPosition += imgHeight + 15;
                    } catch (err) {
                        console.error('Could not add image', err);
                    }
                    resolve();
                };
                tempImg.src = imgData;
            } else {
                resolve();
            }
        };
        reader.readAsDataURL(image);
    });

    // Full Text Section
    checkPageBreak(30);
    pdf.setFillColor(45, 70, 105); // Dark blue
    pdf.rect(margin, yPosition, contentWidth, 10, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Volltext', margin + 3, yPosition + 7);
    yPosition += 15;

    // Add full text
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    const fullTextLines = pdf.splitTextToSize(transcription.fullText, contentWidth);
    fullTextLines.forEach((line: string) => {
        checkPageBreak(5);
        pdf.text(line, margin, yPosition);
        yPosition += 5;
    });
    yPosition += 10;

    // Segments Section
    if (transcription.segments.length > 0) {
        checkPageBreak(30);
        pdf.setFillColor(70, 100, 70); // Dark green
        pdf.rect(margin, yPosition, contentWidth, 10, 'F');
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Segmente (mit Konfidenz)', margin + 3, yPosition + 7);
        yPosition += 15;

        transcription.segments.forEach((segment, index) => {
            checkPageBreak(15);

            // Confidence color
            let confidenceColor: number[];
            if (segment.confidence >= 95) {
                confidenceColor = [0, 150, 0]; // Green
            } else if (segment.confidence >= 70) {
                confidenceColor = [200, 150, 0]; // Yellow
            } else {
                confidenceColor = [200, 0, 0]; // Red
            }

            // Segment text
            pdf.setTextColor(0, 0, 0);
            pdf.setFontSize(10);
            pdf.setFont('helvetica', 'normal');
            const segmentLines = pdf.splitTextToSize(
                `${index + 1}. ${segment.text}`,
                contentWidth - 25
            );
            pdf.text(segmentLines, margin, yPosition);
            const textHeight = segmentLines.length * 4;

            // Confidence badge
            pdf.setFontSize(8);
            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor(confidenceColor[0], confidenceColor[1], confidenceColor[2]);
            pdf.text(
                `${segment.confidence}%`,
                pageWidth - margin - 15,
                yPosition
            );

            yPosition += textHeight + 3;
        });
    }

    // Footer
    pdf.setFontSize(8);
    pdf.setTextColor(100, 100, 100);
    pdf.setFont('helvetica', 'italic');
    pdf.text(
        'Powered by Heimatverein Vorchdorf - Kurrent App',
        margin,
        pageHeight - 10
    );

    // Save PDF
    const timestamp = new Date().toISOString().split('T')[0];
    pdf.save(`Kurrent_Transkription_${timestamp}.pdf`);
};
