export interface AnalysisResult {
    speed: number;
    techniqueScore: number;
    feedback: string[];
}

export interface AnalysisSession {
    id: string;
    playerId: string;
    videoUri: string;
    date: number;
    status: 'processing' | 'completed' | 'failed';
    result?: AnalysisResult;
    videoType?: string;
    thumbnailUrl?: string;
}
