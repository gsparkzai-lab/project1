import { Player } from '../../domain/models/Player';
import { IPlayerRepository } from '../../domain/repositories/IPlayerRepository';
import { db } from '../local/db';

export class PlayerRepository implements IPlayerRepository {
    async getPlayers(): Promise<Player[]> {
        const result = await db.getAllAsync('SELECT * FROM players ORDER BY created_at DESC');
        return result.map((row: any) => ({
            id: row.id,
            name: row.name,
            email: row.email,
            phone: row.phone,
            level: row.level,
            createdAt: row.created_at,
        }));
    }

    async getPlayerById(id: string): Promise<Player | null> {
        const result = await db.getFirstAsync('SELECT * FROM players WHERE id = ?', [id]);
        if (!result) return null;
        const row = result as any;
        return {
            id: row.id,
            name: row.name,
            email: row.email,
            phone: row.phone,
            level: row.level,
            createdAt: row.created_at,
        };
    }

    async createPlayer(player: Player): Promise<void> {
        await db.runAsync(
            'INSERT INTO players (id, name, email, phone, level, created_at) VALUES (?, ?, ?, ?, ?, ?)',
            [player.id, player.name, player.email ?? null, player.phone ?? null, player.level ?? 'Beginner', player.createdAt]
        );
    }

    async updatePlayer(player: Player): Promise<void> {
        await db.runAsync(
            'UPDATE players SET name = ?, email = ?, phone = ?, level = ? WHERE id = ?',
            [player.name, player.email ?? null, player.phone ?? null, player.level ?? 'Beginner', player.id]
        );
    }

    async deletePlayer(id: string): Promise<void> {
        await db.runAsync('DELETE FROM players WHERE id = ?', [id]);
    }
}
