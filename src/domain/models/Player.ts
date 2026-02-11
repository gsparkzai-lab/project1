export interface Player {
    id: string;
    name: string;
    email?: string;
    phone?: string;
    level?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Pro';
    createdAt: number;
    imageUrl?: string;
}
