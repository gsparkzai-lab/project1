import { create } from 'zustand';
import { TrainingSession } from '../domain/models/Schedule';

interface ScheduleState {
    sessions: TrainingSession[];
    addSession: (session: TrainingSession) => void;
    removeSession: (sessionId: string) => void;
    updateSession: (session: TrainingSession) => void;
}

// Sample scheduled sessions updated with time range structure
const sampleSessions: TrainingSession[] = [
    {
        id: 's1',
        playerIds: ['1'],
        playerNames: ['Serena Williams'],
        date: new Date().toISOString().split('T')[0],
        startTime: '10:00',
        endTime: '11:00',
        type: 'Private',
        status: 'Scheduled',
    },
    {
        id: 's2',
        playerIds: ['2', '4'],
        playerNames: ['Rafael Nadal', 'Carlos Alcaraz'],
        date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        startTime: '14:30',
        endTime: '16:00',
        type: 'Group',
        status: 'Scheduled',
    },
];

export const useScheduleStore = create<ScheduleState>((set) => ({
    sessions: sampleSessions,
    addSession: (session) => set((state) => ({ sessions: [...state.sessions, session] })),
    removeSession: (sessionId) => set((state) => ({ sessions: state.sessions.filter(s => s.id !== sessionId) })),
    updateSession: (session) => set((state) => ({
        sessions: state.sessions.map((s) => s.id === session.id ? session : s),
    })),
}));
