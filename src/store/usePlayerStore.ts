import { create } from 'zustand';
import { PlayerRepository } from '../data/repositories/PlayerRepository';
import { Player } from '../domain/models/Player';

// Sample players with image URLs
const samplePlayers: Player[] = [
    {
        id: '1',
        name: 'Serena Williams',
        email: 'serena@tennis.com',
        phone: '+1 555-0101',
        level: 'Advanced',
        createdAt: Date.now() - 86400000 * 90,
        imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
    },
    {
        id: '2',
        name: 'Rafael Nadal',
        email: 'rafa@tennis.com',
        phone: '+34 555-0202',
        level: 'Advanced',
        createdAt: Date.now() - 86400000 * 60,
        imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
    },
    {
        id: '3',
        name: 'Emma Raducanu',
        email: 'emma@tennis.com',
        phone: '+44 555-0303',
        level: 'Intermediate',
        createdAt: Date.now() - 86400000 * 30,
        imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop',
    },
    {
        id: '4',
        name: 'Carlos Alcaraz',
        email: 'carlos@tennis.com',
        phone: '+34 555-0404',
        level: 'Advanced',
        createdAt: Date.now() - 86400000 * 15,
        imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
    },
    {
        id: '5',
        name: 'John Smith',
        email: 'john@tennis.com',
        phone: '+1 555-0505',
        level: 'Beginner',
        createdAt: Date.now() - 86400000 * 7,
        imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop',
    },
    {
        id: '6',
        name: 'Maria Garcia',
        email: 'maria@tennis.com',
        phone: '+1 555-0606',
        level: 'Intermediate',
        createdAt: Date.now() - 86400000 * 45,
        imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop',
    },
    {
        id: '7',
        name: 'David Chen',
        email: 'david@tennis.com',
        phone: '+1 555-0707',
        level: 'Beginner',
        createdAt: Date.now() - 86400000 * 20,
        imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop',
    },
];

interface PlayerState {
    players: Player[];
    isLoading: boolean;
    repository: PlayerRepository;
    fetchPlayers: () => Promise<void>;
    addPlayer: (player: Player) => Promise<void>;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
    players: samplePlayers,
    isLoading: false,
    repository: new PlayerRepository(),

    fetchPlayers: async () => {
        set({ isLoading: true });
        try {
            // For now, just use sample data
            set({ players: samplePlayers });
        } catch (e) {
            console.error(e);
        } finally {
            set({ isLoading: false });
        }
    },

    addPlayer: async (player) => {
        try {
            await get().repository.createPlayer(player);
            set((state) => ({ players: [player, ...state.players] }));
        } catch (e) {
            console.error(e);
        }
    },
}));
