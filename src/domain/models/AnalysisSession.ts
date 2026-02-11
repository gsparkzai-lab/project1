export interface AnalysisSession {
    id: string;
    playerId: string;
    videoUri: string;
    thumbnailUri?: string;
    date: number;
    status: 'processing' | 'completed' | 'failed';
    result?: {
        speed: number;
        accuracy: number;
        techniqueScore: number;
        feedback: string[];
    };
}
