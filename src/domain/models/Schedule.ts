export interface TrainingSession {
    id: string;
    playerIds: string[];
    playerNames: string[];
    date: string; // YYYY-MM-DD
    startTime: string; // HH:mm
    endTime: string; // HH:mm
    type: 'Private' | 'Group' | 'Match';
    notes?: string;
    status: 'Scheduled' | 'Completed' | 'Cancelled';
}
