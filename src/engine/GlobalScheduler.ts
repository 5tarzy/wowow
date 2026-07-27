import { WorldState, Club, Player } from '../types';
import { processDailyRecovery } from './InjuryEngine';

export const advanceDay = (world: WorldState): WorldState => {
  // 1. Advance calendar date by 1 day
  const dateObj = new Date(world.currentDate);
  dateObj.setDate(dateObj.getDate() + 1);
  const newDate = dateObj.toISOString().split('T')[0]; // Format: YYYY-MM-DD

  // 2. Process daily recovery for all players in the universe
  const updatedClubs = world.clubs.map((club: Club) => {
    const updatedPlayers = club.players.map((player: Player) => {
      // Restores stamina and eventually handles injury countdowns
      return processDailyRecovery(player);
    });

    return { ...club, players: updatedPlayers };
  });

  return {
    ...world,
    currentDate: newDate,
    clubs: updatedClubs
  };
};
