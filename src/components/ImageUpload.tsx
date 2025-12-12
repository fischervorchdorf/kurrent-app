import React, { useRef, useState } from 'react';
import { Upload, Camera, Image as ImageIcon } from 'lucide-react';

interface ImageUploadProps {
    onImageSelected: (file: File) => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ onImageSelected }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const cameraInputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            onImageSelected(event.target.files[0]);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            if (file.type.startsWith('image/')) {
                onImageSelected(file);
            }
        }
    };

    return (
        <div className="w-full max-w-3xl mx-auto mt-8">
            <div
                className={`
          relative border-2 border-dashed rounded-xl p-8 md:p-16 text-center transition-all duration-300
          flex flex-col items-center justify-center gap-6 bg-white shadow-sm
          ${isDragging ? 'border-[#c5a059] bg-[#fcfaf5]' : 'border-gray-300 hover:border-[#c5a059] hover:bg-gray-50'}
        `}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <div className="p-4 rounded-full bg-[#f4f1ea] text-[#8c867a]">
                    <Upload size={48} strokeWidth={1.5} />
                </div>

                <div className="space-y-2">
                    <h3 className="text-xl font-serif font-semibold text-[#2d2a26]">
                        Kurrentschrift hochladen
                    </h3>
                    <p className="text-gray-500 max-w-sm mx-auto">
                        Laden Sie ein Foto oder Scan von Kurrentschrift hoch. Die KI entziffert den Text automatisch.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md justify-center pt-4">
                    <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                    />
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-[#2d2a26] text-white rounded-lg hover:bg-[#403d38] transition-colors shadow-md"
                    >
                        <ImageIcon size={20} />
                        <span>Galerie öffnen</span>
                    </button>

                    <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        className="hidden"
                        ref={cameraInputRef}
                        onChange={handleFileChange}
                    />
                    <button
                        onClick={() => cameraInputRef.current?.click()}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-[#c5a059] text-[#2d2a26] rounded-lg hover:bg-[#d4b06a] transition-colors shadow-md font-semibold"
                    >
                        <Camera size={20} />
                        <span>Foto aufnehmen</span>
                    </button>
                </div>
            </div>

            {/* Info */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-900">
                        <strong className="block mb-1">📸 Foto-Tipps:</strong>
                        Fotografieren Sie bei guter Beleuchtung mit minimalen Schatten. Halten Sie die Kamera parallel zum Dokument.
                    </p>
                </div>
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-900">
                        <strong className="block mb-1">📄 Dateiformat:</strong>
                        <strong>JPG</strong> empfohlen (kleiner, schneller) •
                        <strong> PNG</strong> auch OK •
                        Max. <strong>3-5 MB</strong> für beste Performance
                    </p>
                </div>
            </div>
        </div>
    );
};
