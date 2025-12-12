export enum AppState {
    IDLE = 'IDLE',
    TRANSCRIBING = 'TRANSCRIBING',
    RESULTS = 'RESULTS',
    ERROR = 'ERROR'
}

export interface TranscriptionSegment {
    text: string;
    confidence: number; // 0-100
}

export interface TranscriptionResult {
    segments: TranscriptionSegment[];
    fullText: string;
}
