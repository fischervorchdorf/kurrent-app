import React, { useState } from 'react';
import { Header } from './components/Header';
import { ImageUpload } from './components/ImageUpload';
import { TranscriptionView } from './components/TranscriptionView';
import { LoadingState } from './components/LoadingState';
import { InfoModal } from './components/InfoModal';
import { transcribeKurrent } from './services/geminiService';
import { AppState, TranscriptionResult } from './types';
import { AlertCircle } from 'lucide-react';

const App: React.FC = () => {
    const [appState, setAppState] = useState<AppState>(AppState.IDLE);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [transcription, setTranscription] = useState<TranscriptionResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

    const handleImageSelected = async (file: File) => {
        setSelectedImage(file);
        setError(null);
        setAppState(AppState.TRANSCRIBING);

        try {
            const result = await transcribeKurrent(file);
            setTranscription(result);
            setAppState(AppState.RESULTS);
        } catch (err) {
            console.error(err);
            setError("Die Transkription konnte nicht durchgeführt werden. Bitte versuchen Sie es erneut.");
            setAppState(AppState.ERROR);
        }
    };

    const handleReset = () => {
        setSelectedImage(null);
        setTranscription(null);
        setError(null);
        setAppState(AppState.IDLE);
    };

    return (
        <div className="min-h-screen bg-[#fdfcf8] flex flex-col font-sans">
            <Header onInfoClick={() => setIsInfoModalOpen(true)} />
            <InfoModal isOpen={isInfoModalOpen} onClose={() => setIsInfoModalOpen(false)} />

            <main className="flex-grow container mx-auto max-w-7xl p-4">

                {appState === AppState.IDLE && (
                    <div className="fade-in">
                        <div className="max-w-3xl mx-auto text-center py-12">
                            <div className="inline-block px-3 py-1 border border-museum-gold/30 rounded-full bg-amber-50/50 mb-4">
                                <span className="text-museum-gold text-xs font-bold tracking-[0.2em] uppercase">KI-Powered Translation</span>
                            </div>
                            <h2 className="text-4xl md:text-6xl font-serif text-museum-charcoal leading-tight">
                                Alte Schrift <br />
                                <span className="text-transparent bg-clip-text bg-gold-gradient italic pr-2">modern lesbar</span>
                            </h2>
                            <p className="text-museum-sage text-sm opacity-80 pl-4 border-l border-museum-sage/30">
                                Ein KI-Experiment des Heimatvereins Vorchdorf (v5.1)
                            </p>          <p className="text-lg text-gray-600 leading-relaxed mt-4">
                                Entziffern Sie Kurrentschrift automatisch mit modernster KI. Unsichere Stellen werden farblich markiert.
                            </p>
                        </div>
                        <ImageUpload onImageSelected={handleImageSelected} />
                    </div>
                )}

                {appState === AppState.TRANSCRIBING && (
                    <LoadingState />
                )}

                {appState === AppState.RESULTS && selectedImage && transcription && (
                    <TranscriptionView
                        image={selectedImage}
                        result={transcription}
                        onReset={handleReset}
                    />
                )}

                {appState === AppState.ERROR && (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="bg-red-50 p-6 rounded-full mb-4">
                            <AlertCircle size={48} className="text-red-500" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Ein Fehler ist aufgetreten</h3>
                        <p className="text-gray-600 max-w-md mb-8">{error}</p>
                        <button
                            onClick={handleReset}
                            className="px-6 py-3 bg-[#2d2a26] text-white rounded-lg hover:bg-[#403d38] transition-colors"
                        >
                            Erneut versuchen
                        </button>
                    </div>
                )}

            </main>

            <footer className="bg-white border-t border-gray-200 py-6 mt-auto">
                <div className="container mx-auto text-center text-sm text-gray-400">
                    <p>&copy; {new Date().getFullYear()} Kurrent goes Future. Powered by Gemini AI.</p>
                </div>
            </footer>
        </div>
    );
};

export default App;
