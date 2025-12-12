import React from 'react';
import { TranscriptionResult } from '../types';
import { ArrowLeft, Copy, Download, CheckCircle2, FileDown } from 'lucide-react';
import { generatePDF } from '../services/pdfService';

interface TranscriptionViewProps {
    image: File;
    result: TranscriptionResult;
    onReset: () => void;
}

export const TranscriptionView: React.FC<TranscriptionViewProps> = ({ image, result, onReset }) => {
    const imageUrl = React.useMemo(() => URL.createObjectURL(image), [image]);
    const [copied, setCopied] = React.useState(false);
    const [generatingPDF, setGeneratingPDF] = React.useState(false);

    const getConfidenceColor = (confidence: number): string => {
        if (confidence >= 95) return 'text-green-600 bg-green-50 border-green-200';
        if (confidence >= 70) return 'text-yellow-700 bg-yellow-50 border-yellow-200';
        return 'text-red-600 bg-red-50 border-red-200';
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(result.fullText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownload = () => {
        const blob = new Blob([result.fullText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `kurrent-transkription-${Date.now()}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handlePDFDownload = async () => {
        try {
            setGeneratingPDF(true);
            await generatePDF(result, image);
        } catch (error) {
            console.error('PDF generation failed:', error);
            alert('PDF konnte nicht erstellt werden. Bitte versuchen Sie es erneut.');
        } finally {
            setGeneratingPDF(false);
        }
    };

    return (
        <div className="w-full max-w-6xl mx-auto pt-6 pb-12 px-4">
            <button
                onClick={onReset}
                className="flex items-center gap-2 text-gray-500 hover:text-[#2d2a26] mb-6 transition-colors print:hidden"
            >
                <ArrowLeft size={20} />
                <span>Zurück</span>
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">

                {/* Original Image */}
                <div className="flex flex-col gap-6">
                    <h3 className="text-lg font-serif font-semibold text-[#2d2a26]">Original</h3>
                    <div className="relative rounded-lg overflow-hidden shadow-lg border-4 border-white bg-white">
                        <img
                            src={imageUrl}
                            alt="Original Kurrentschrift"
                            className="w-full h-auto max-h-[70vh] object-contain bg-black/5"
                        />
                    </div>
                </div>

                {/* Transcription */}
                <div className="flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-serif font-semibold text-[#2d2a26]">Transkription</h3>
                        <div className="flex gap-2">
                            <button
                                onClick={handleCopy}
                                className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 text-gray-700"
                                title="In Zwischenablage kopieren"
                            >
                                {copied ? <CheckCircle2 size={16} className="text-green-600" /> : <Copy size={16} />}
                                <span className="hidden sm:inline">{copied ? 'Kopiert!' : 'Kopieren'}</span>
                            </button>
                            <button
                                onClick={handleDownload}
                                className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 text-gray-700"
                                title="Als Textdatei herunterladen"
                            >
                                <Download size={16} />
                                <span className="hidden sm:inline">TXT</span>
                            </button>
                            <button
                                onClick={handlePDFDownload}
                                disabled={generatingPDF}
                                className="flex items-center gap-2 px-3 py-2 text-sm bg-[#2d2a26] text-white rounded-md hover:bg-[#403d38] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Als PDF herunterladen"
                            >
                                <FileDown size={16} />
                                <span className="hidden sm:inline">{generatingPDF ? 'Erstelle...' : 'PDF'}</span>
                            </button>
                        </div>
                    </div>

                    {/* Confidence Legend */}
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <h4 className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">Konfidenz-Legende:</h4>
                        <div className="flex flex-wrap gap-3 text-xs">
                            <div className="flex items-center gap-1.5">
                                <div className="w-3 h-3 rounded bg-green-500"></div>
                                <span>Sehr sicher (95-100%)</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="w-3 h-3 rounded bg-yellow-500"></div>
                                <span>Ziemlich sicher (70-94%)</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="w-3 h-3 rounded bg-red-500"></div>
                                <span>Unsicher (&lt;70%)</span>
                            </div>
                        </div>
                    </div>

                    {/* Transcribed Text with Color Coding */}
                    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 md:p-8 overflow-y-auto max-h-[600px]">
                        <div className="space-y-2 text-base leading-relaxed">
                            {result.segments.map((segment, index) => (
                                <span
                                    key={index}
                                    className={`inline-block px-2 py-1 mx-0.5 my-0.5 rounded border ${getConfidenceColor(segment.confidence)}`}
                                    title={`Konfidenz: ${segment.confidence}%`}
                                >
                                    {segment.text}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Plain Text */}
                    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                        <h4 className="text-sm font-semibold text-gray-600 mb-3">Volltext (ohne Markierungen):</h4>
                        <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{result.fullText}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
