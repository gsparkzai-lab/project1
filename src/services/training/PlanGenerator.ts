export interface TrainingPlan {
    id: string;
    playerId: string;
    playerName: string;
    generatedAt: number;
    focusArea: 'Speed' | 'Power' | 'Technique' | 'Stamina';
    drills: string[];
}

export const generatePlan = (playerName: string, level: string): TrainingPlan => {
    const drills = level === 'Beginner'
        ? ['Wall volley (10 mins)', 'Forehand toss feed (15 mins)', 'Mini tennis (10 mins)']
        : level === 'Intermediate'
            ? ['Cross-court rallies (15 mins)', 'Serve placement drills (15 mins)', 'Approach shots (20 mins)']
            : ['High-intensity interval feeding (20 mins)', 'Match play simulation (30 mins)', 'Target serving under pressure (20 mins)'];

    return {
        id: Math.random().toString(),
        playerId: 'mock-id',
        playerName,
        generatedAt: Date.now(),
        focusArea: 'Technique',
        drills,
    };
};
