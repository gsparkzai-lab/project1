import { create } from 'zustand';
import { AnalysisSession } from '../domain/models/Analysis';
import { mockAnalyzeVideo } from '../services/ai/VideoAnalyzer';

// 5 Sample analysis sessions with video thumbnails

// 5 Sample analysis sessions with video thumbnails
const sampleSessions: AnalysisSession[] = [
    {
        id: 'session-1',
        playerId: '1',
        videoUri: 'sample://serve_video_1.mp4',
        date: Date.now() - 86400000 * 2,
        status: 'completed',
        videoType: 'Serve',
        thumbnailUrl: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=400&h=300&fit=crop',
        result: {
            speed: 185,
            techniqueScore: 9.2,
            feedback: [
                'Excellent ball toss consistency and height',
                'Great hip rotation generating power',
                'Smooth follow-through motion',
                'Strong wrist snap on contact',
            ],
        },
    },
    {
        id: 'session-2',
        playerId: '2',
        videoUri: 'sample://forehand_video_1.mp4',
        date: Date.now() - 86400000 * 5,
        status: 'completed',
        videoType: 'Forehand',
        thumbnailUrl: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=400&h=300&fit=crop',
        result: {
            speed: 142,
            techniqueScore: 9.5,
            feedback: [
                'Perfect topspin technique with heavy racket acceleration',
                'Excellent footwork and court positioning',
                'Strong shoulder rotation through the shot',
                'Ideal contact point in front of body',
            ],
        },
    },
    {
        id: 'session-3',
        playerId: '3',
        videoUri: 'sample://backhand_video_1.mp4',
        date: Date.now() - 86400000 * 7,
        status: 'completed',
        videoType: 'Backhand',
        thumbnailUrl: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=400&h=300&fit=crop',
        result: {
            speed: 118,
            techniqueScore: 7.8,
            feedback: [
                'Good two-handed grip technique',
                'Consider stepping into the shot more',
                'Nice racket head speed through contact',
                'Work on follow-through extension',
            ],
        },
    },
    {
        id: 'session-4',
        playerId: '4',
        videoUri: 'sample://volley_video_1.mp4',
        date: Date.now() - 86400000 * 10,
        status: 'completed',
        videoType: 'Volley',
        thumbnailUrl: 'https://images.unsplash.com/photo-1545809074-59472b3f5efc?w=400&h=300&fit=crop',
        result: {
            speed: 95,
            techniqueScore: 8.4,
            feedback: [
                'Excellent reactions at the net',
                'Good continental grip for volleys',
                'Nice split step timing',
                'Consider shorter backswing for faster exchanges',
            ],
        },
    },
    {
        id: 'session-5',
        playerId: '1',
        videoUri: 'sample://serve_video_2.mp4',
        date: Date.now() - 86400000 * 14,
        status: 'completed',
        videoType: 'Serve',
        thumbnailUrl: 'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=400&h=300&fit=crop',
        result: {
            speed: 178,
            techniqueScore: 8.9,
            feedback: [
                'Strong leg drive from the ground',
                'Good trophy position reached',
                'Consistent ball toss location',
                'Consider more pronation on second serves',
            ],
        },
    },
];

interface AnalysisStore {
    sessions: AnalysisSession[];
    isAnalyzing: boolean;
    startAnalysis: (playerId: string, videoUri: string, videoType?: string) => Promise<void>;
}

export const useAnalysisStore = create<AnalysisStore>((set, get) => ({
    sessions: sampleSessions,
    isAnalyzing: false,

    startAnalysis: async (playerId, videoUri, videoType) => {
        const newSession: AnalysisSession = {
            id: `session-${Date.now()}`,
            playerId,
            videoUri,
            date: Date.now(),
            status: 'processing',
            videoType: videoType || 'General',
            thumbnailUrl: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=400&h=300&fit=crop',
        };

        set((state) => ({ sessions: [newSession, ...state.sessions], isAnalyzing: true }));

        try {
            const result = await mockAnalyzeVideo(newSession.id);
            set((state) => ({
                sessions: state.sessions.map((s) =>
                    s.id === newSession.id
                        ? { ...s, status: 'completed' as const, result }
                        : s
                ),
            }));
        } catch (error) {
            set((state) => ({
                sessions: state.sessions.map((s) =>
                    s.id === newSession.id ? { ...s, status: 'failed' as const } : s
                ),
            }));
        } finally {
            set({ isAnalyzing: false });
        }
    },
}));
