import { Player } from "../models/Player";

export interface IPlayerRepository {
    getPlayers(): Promise<Player[]>;
    getPlayerById(id: string): Promise<Player | null>;
    createPlayer(player: Player): Promise<void>;
    updatePlayer(player: Player): Promise<void>;
    deletePlayer(id: string): Promise<void>;
}
