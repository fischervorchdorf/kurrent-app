import React from 'react';
import { FileText, Sparkles, Info } from 'lucide-react';

interface HeaderProps {
    onInfoClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onInfoClick }) => {
    return (
        <header className="bg-[#2d2a26] text-[#fdfcf8] py-4 px-6 shadow-md border-b-4 border-[#c5a059] print:hidden">
            <div className="max-w-5xl mx-auto flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#c5a059] rounded-lg text-[#2d2a26]">
                        <FileText size={24} />
                    </div>
                    <div>
                        <h1 className="text-xl md:text-2xl font-bold tracking-wider serif">KURRENT GOES FUTURE</h1>
                        <p className="text-xs text-[#c5a059] uppercase tracking-widest font-medium">Historische Schrift AI-gestützt entziffern</p>
                        <p className="text-[10px] text-gray-400 italic mt-0.5">Powered by Heimatverein Vorchdorf</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={onInfoClick}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#c5a059]/10 border border-[#c5a059]/30 hover:bg-[#c5a059]/20 transition-colors"
                        title="Was ist Kurrentschrift?"
                    >
                        <Info size={18} className="text-[#c5a059]" />
                        <span className="text-xs text-gray-300 hidden sm:inline">Was ist Kurrent?</span>
                    </button>
                    <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg bg-[#c5a059]/10 border border-[#c5a059]/30">
                        <Sparkles size={16} className="text-[#c5a059]" />
                        <span className="text-xs text-gray-300">KI-Unterstützt</span>
                    </div>
                </div>
            </div>
        </header>
    );
};
