import { AnalysisSession } from "../../domain/models/AnalysisSession";

export const mockAnalyzeVideo = async (sessionId: string): Promise<AnalysisSession['result']> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                speed: Math.floor(Math.random() * 50) + 100, // 100-150 km/h
                accuracy: Math.floor(Math.random() * 30) + 70, // 70-100%
                techniqueScore: Math.floor(Math.random() * 5) + 5, // 5-10
                feedback: [
                    "Follow through needs improvement.",
                    "Good footwork during the approach.",
                    "Toss was slightly too low.",
                ],
            });
        }, 3000); // Simulate 3s processing
    });
};
