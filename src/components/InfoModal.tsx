import React from 'react';
import { X, BookOpen, Calendar, Globe, Users } from 'lucide-react';

interface InfoModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
            <div className="bg-[#fdfcf8] rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border-4 border-[#c5a059]">
                {/* Header */}
                <div className="sticky top-0 bg-[#2d2a26] text-white p-6 flex items-center justify-between border-b-4 border-[#c5a059]">
                    <div className="flex items-center gap-3">
                        <BookOpen size={28} className="text-[#c5a059]" />
                        <h2 className="text-2xl font-serif font-bold">Was ist Kurrentschrift?</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        aria-label="Schließen"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-8 space-y-6">

                    {/* Intro */}
                    <div className="bg-amber-50 border-l-4 border-[#c5a059] p-4 rounded-r-lg">
                        <p className="text-gray-800 leading-relaxed">
                            <strong>Kurrentschrift</strong> (von lateinisch <em>currere</em> = laufen) ist eine
                            Schreibschrift des deutschen Sprachraums, die vom 16. bis ins 20. Jahrhundert
                            verwendet wurde.
                        </p>
                    </div>

                    {/* Geschichte */}
                    <div className="space-y-4">
                        <div className="flex items-start gap-3">
                            <Calendar size={24} className="text-[#c5a059] mt-1 flex-shrink-0" />
                            <div>
                                <h3 className="font-serif font-bold text-lg text-[#2d2a26] mb-2">Zeitlicher Verlauf</h3>
                                <ul className="space-y-2 text-gray-700">
                                    <li><strong>15.-16. Jahrhundert:</strong> Entwicklung aus der gotischen Kursive</li>
                                    <li><strong>1714:</strong> Sütterlin-Form wird standardisiert</li>
                                    <li><strong>1915:</strong> Ludwig Sütterlin entwickelt die „Deutsche Schrift"</li>
                                    <li><strong>1941:</strong> Verbot durch NS-Regime („Normalschrifterlass")</li>
                                    <li><strong>Nach 1945:</strong> Weitgehend durch lateinische Schrift ersetzt</li>
                                </ul>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <Globe size={24} className="text-[#c5a059] mt-1 flex-shrink-0" />
                            <div>
                                <h3 className="font-serif font-bold text-lg text-[#2d2a26] mb-2">Verbreitung</h3>
                                <p className="text-gray-700">
                                    Die Kurrentschrift wurde hauptsächlich in Deutschland, Österreich, der Schweiz
                                    und anderen deutschsprachigen Gebieten verwendet. Sie war die Standard-Handschrift
                                    für alltägliche Korrespondenz, Urkunden, Briefe und amtliche Dokumente.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <Users size={24} className="text-[#c5a059] mt-1 flex-shrink-0" />
                            <div>
                                <h3 className="font-serif font-bold text-lg text-[#2d2a26] mb-2">Verwendung</h3>
                                <p className="text-gray-700 mb-2">
                                    Kurrentschrift findet man heute noch in:
                                </p>
                                <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                                    <li>Historischen Dokumenten & Urkunden</li>
                                    <li>Alten Briefen & Tagebüchern</li>
                                    <li>Kirchenbüchern & Standesamtsregistern</li>
                                    <li>Familienchroniken</li>
                                    <li>Historischen Karten & Plänen</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Besonderheiten */}
                    <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                        <h3 className="font-serif font-bold text-lg text-[#2d2a26] mb-3">💡 Interessante Fakten</h3>
                        <ul className="space-y-2 text-gray-700">
                            <li>• Buchstaben sind oft miteinander verbunden (daher "laufende Schrift")</li>
                            <li>• Viele Buchstaben sehen anders aus als in lateinischer Schrift</li>
                            <li>• Es gibt regionale Variationen und persönliche Schreibstile</li>
                            <li>• Die Entzifferung erfordert Übung und Spezialwissen</li>
                        </ul>
                    </div>

                    {/* CTA */}
                    <div className="bg-gradient-to-r from-[#c5a059]/10 to-[#c5a059]/5 p-6 rounded-lg border-2 border-[#c5a059]/30">
                        <p className="text-center text-gray-800 font-medium">
                            🤖 Mit moderner KI können wir diese historische Schrift wieder lesbar machen
                            und vergessene Geschichten zum Leben erwecken!
                        </p>
                    </div>

                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-gray-100 p-4 border-t border-gray-200 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-[#2d2a26] text-white rounded-lg hover:bg-[#403d38] transition-colors font-semibold"
                    >
                        Schließen
                    </button>
                </div>
            </div>
        </div>
    );
};
