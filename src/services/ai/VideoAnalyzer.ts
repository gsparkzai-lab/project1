import { AnalysisResult } from '../../domain/models/Analysis';

// Mock AI video analysis service
export const mockAnalyzeVideo = async (sessionId: string): Promise<AnalysisResult> => {
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Generate random but realistic results
    const speeds = [120, 135, 142, 155, 168, 175, 185];
    const scores = [7.2, 7.8, 8.1, 8.4, 8.7, 9.0, 9.3, 9.5];

    const feedbackOptions = [
        [
            'Excellent ball toss consistency - maintaining height and placement',
            'Strong hip rotation generating power through the shot',
            'Good follow-through motion completing the stroke',
            'Consider adding more wrist snap at contact point'
        ],
        [
            'Great footwork and court positioning on approach',
            'Nice racket preparation and backswing timing',
            'Solid contact point in front of body',
            'Work on recovery speed after shot completion'
        ],
        [
            'Impressive topspin technique with heavy racket acceleration',
            'Excellent shoulder rotation through contact zone',
            'Strong balance maintained throughout the stroke',
            'Consider deeper knee bend for more power generation'
        ],
        [
            'Good split step timing at the net',
            'Continental grip technique is correct',
            'Quick reaction time to incoming shot',
            'Practice shorter backswing for faster volleys'
        ]
    ];

    return {
        speed: speeds[Math.floor(Math.random() * speeds.length)],
        techniqueScore: scores[Math.floor(Math.random() * scores.length)],
        feedback: feedbackOptions[Math.floor(Math.random() * feedbackOptions.length)],
    };
};
