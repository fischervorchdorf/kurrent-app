import React from 'react';

export const LoadingState: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] fade-in">
            <div className="relative">
                <div className="w-20 h-20 border-4 border-[#f4f1ea] border-t-[#c5a059] rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 bg-[#c5a059]/20 rounded-full animate-pulse"></div>
                </div>
            </div>
            <h3 className="mt-8 text-2xl font-serif text-[#2d2a26]">Entziffere Kurrentschrift...</h3>
            <p className="mt-2 text-gray-500">Die KI analysiert das Schriftbild</p>
            <p className="mt-4 text-sm text-gray-400 max-w-md text-center">
                ⏱️ Große Dokumente können 20-30 Sekunden dauern
            </p>
        </div>
    );
};
