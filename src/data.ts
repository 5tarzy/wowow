import { Player, Club, Position, WorldState, PlayerAttributes } from './types';

// Utility to generate random numbers in a range
const rng = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

// Generates mathematical attributes heavily weighted by position
const generateAttributes = (position: Position, targetOverall: number): PlayerAttributes => {
  const base = Math.max(1, targetOverall - 15);
  const prime = Math.min(99, targetOverall + 10);
  
  const isAtt = position === 'ATT' || position === 'WINGER';
  const isMid = position === 'MID';
  const isDef = position === 'DEF';
  
  return {
    acceleration: isAtt || position === 'WINGER' ? rng(base, prime) : rng(base - 10, prime - 10),
    sprintSpeed: isAtt || position === 'WINGER' ? rng(base, prime) : rng(base - 10, prime - 10),
    attackingPosition: isAtt ? rng(base, prime) : rng(base - 20, prime - 20),
    finishing: isAtt ? rng(base, prime) : rng(base - 30, prime - 20),
    shotPower: isAtt || isMid ? rng(base, prime) : rng(base - 20, prime - 10),
    longShots: isMid ? rng(base, prime) : rng(base - 20, prime - 10),
    volleys: isAtt ? rng(base, prime) : rng(base - 30, prime - 20),
    penalties: rng(base - 20, prime),
    vision: isMid ? rng(base, prime) : rng(base - 20, prime - 10),
    crossing: position === 'WINGER' ? rng(base, prime) : rng(base - 20, prime - 10),
    freeKickAccuracy: rng(base - 20, prime),
    shortPass: isMid || isDef ? rng(base, prime) : rng(base - 10, prime - 10),
    longPass: isMid || isDef ? rng(base, prime) : rng(base - 10, prime - 10),
    curve: rng(base - 20, prime),
    agility: isAtt || position === 'WINGER' ? rng(base, prime) : rng(base - 10, prime - 10),
    balance: rng(base - 10, prime),
    reactions: rng(base, prime),
    ballControl: isMid || isAtt ? rng(base, prime) : rng(base - 10, prime - 10),
    composure: rng(base - 10, prime),
    interceptions: isDef || isMid ? rng(base, prime) : rng(base - 40, prime - 30),
    headingAccuracy: isDef || position === 'ATT' ? rng(base, prime) : rng(base - 20, prime - 20),
    defensiveAwareness: isDef ? rng(base, prime) : rng(base - 40, prime - 30),
    standTackle: isDef || isMid ? rng(base, prime) : rng(base - 40, prime - 30),
    slideTackle: isDef ? rng(base, prime) : rng(base - 40, prime - 30),
    jumping: rng(base - 10, prime),
    stamina: rng(base, prime),
    strength: isDef || position === 'ATT' ? rng(base, prime) : rng(base - 20, prime - 10),
    aggression: isDef || isMid ? rng(base, prime) : rng(base - 20, prime - 10),
  };
};

const generatePlayer = (id: string, name: string, position: Position, age: number, overall: number, potential: number): Player => {
  return {
    id,
    name,
    nationality: 'Unknown',
    birthDate: `${2026 - age}-01-01`, // Dynamic based on current year
    age,
    effectiveCareerAge: age,
    position,
    attributes: generateAttributes(position, overall),
    overall,
    potential,
    value: Math.floor(Math.pow(overall, 3) * 10) + (potential > overall ? 5000000 : 0),
    form: 75,
    fitness: 100,
    contract: { wage: overall * 1000, expiringYear: 2029 },
    stats: { goals: 0, assists: 0, shots: 0, shotsOnTarget: 0, xG: 0, xA: 0, possession: 0, passesCompleted: 0, keyPasses: 0, tackles: 0, interceptions: 0, saves: 0, yellowCards: 0, redCards: 0, appearances: 0, minutesPlayed: 0, cleanSheets: 0, rating: 0 },
    historicalStats: [],
    injuryProfile: { overallResistance: rng(60, 95), muscleResistance: rng(60, 95), ligamentResistance: rng(60, 95), history: [], workload30Days: 0 },
    milestones: []
  };
};

// Procedurally generate a full squad of 18 players
const generateSquad = (teamPrefix: string, baseRating: number): Player[] => {
  const positions: Position[] = ['GK', 'GK', 'DEF', 'DEF', 'DEF', 'DEF', 'DEF', 'DEF', 'MID', 'MID', 'MID', 'MID', 'MID', 'WINGER', 'WINGER', 'ATT', 'ATT', 'ATT'];
  return positions.map((pos, index) => 
    generatePlayer(`${teamPrefix}-p${index}`, `Player ${index + 1}`, pos, rng(18, 34), rng(baseRating - 5, baseRating + 5), rng(baseRating, 95))
  );
};

export const defaultClubs: Club[] = [
  {
    id: 'club-1', name: 'Manchester City FC', shortName: 'MCI', country: 'England', league: 'Premier League',
    reputation: 95, balance: 200000000, wageBudget: 5000000, transferBudget: 150000000,
    facilitiesRating: 98, academyRating: 90, medicalStaffRating: 95,
    players: generateSquad('mci', 85), staff: [], aiControlled: false, transferPolicy: 'Balanced'
  },
  {
    id: 'club-2', name: 'Real Madrid CF', shortName: 'RMA', country: 'Spain', league: 'La Liga',
    reputation: 98, balance: 250000000, wageBudget: 6000000, transferBudget: 200000000,
    facilitiesRating: 99, academyRating: 95, medicalStaffRating: 90,
    players: generateSquad('rma', 86), staff: [], aiControlled: true, transferPolicy: 'Aggressive'
  }
];

export const getInitialWorldState = (): WorldState => ({
  currentDate: '2026-08-01',
  season: 1,
  clubs: defaultClubs,
  freeAgents: [],
  matchHistory: [],
  hallOfFame: { players: [], managers: [] }
});
