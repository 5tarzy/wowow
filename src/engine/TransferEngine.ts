import { Player, Club } from '../types';

// Requirement #29 & #30: Dynamic Transfer Value and Market Inflation
export const calculatePlayerValue = (player: Player, globalInflationRate: number = 1.0): number => {
  // Base value relies exponentially on Current Overall
  const baseValue = Math.pow(player.overall, 3) * 15;
  
  // Age modifier: Peak value is around 23-27. Drops off a cliff after 32.
  let ageMultiplier = 1.0;
  if (player.age < 21) ageMultiplier = 1.8;      // High potential youth premium
  else if (player.age < 24) ageMultiplier = 1.4;
  else if (player.age > 30) ageMultiplier = 0.7;
  else if (player.age > 33) ageMultiplier = 0.3;

  // Form modifier: A player playing out of their mind is worth more
  const formMultiplier = 0.8 + ((player.form / 100) * 0.4); // Scales from 0.8x to 1.2x
  
  const calculatedValue = baseValue * ageMultiplier * formMultiplier * globalInflationRate;
  
  return Math.round(calculatedValue);
};

// AI Logic for evaluating a transfer target (Requirement #31)
export const evaluateTransferTarget = (buyingClub: Club, target: Player): boolean => {
  // 1. Budget Check
  if (buyingClub.transferBudget < target.value * 1.1) return false; 
  
  // 2. Club Policy Check
  if (target.age > 30 && buyingClub.transferPolicy === 'Youth') return false; 
  
  // 3. Squad Improvement Check
  const positionalPeers = buyingClub.players.filter(p => p.position === target.position);
  const avgPositionalOverall = positionalPeers.reduce((sum, p) => sum + p.overall, 0) / (positionalPeers.length || 1);
  
  // The AI will only buy if the player is noticeably better than their current average
  return target.overall > avgPositionalOverall + 2;
};
