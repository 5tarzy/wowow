import { Club, Player, Position, PlayerAttributes } from '../types';

const rng = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

const firstNames = [
  'James', 'Liam', 'Noah', 'Lucas', 'Mason', 'Ethan', 'Alexander', 'Benjamin', 'Daniel', 'Mateo', 
  'Leo', 'Gabriel', 'Julian', 'Carlos', 'Marco', 'Giovanni', 'Lukas', 'Sven', 'Timo', 'Antoine',
  'Enzo', 'Thiago', 'Matteo', 'Santiago', 'Alejandro', 'Samuel', 'David', 'Hugo', 'Arthur', 'Louis',
  'Mohamed', 'Amadou', 'Ibrahim', 'Keita', 'Daiki', 'Hiroto', 'Min-jun', 'Jin-woo', 'Mateusz', 'Kacper',
  'Nikola', 'Luka', 'Dominik', 'Bence', 'Dusan', 'Milan', 'Emil', 'Rasmus', 'Mikael', 'Jesper',
  'Goncalo', 'Diogo', 'Rui', 'Joao', 'Francisco', 'Alvaro', 'Iker', 'Unai', 'Pedri', 'Gavi'
];

const lastNames = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 
  'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 
  'Silva', 'Santos', 'Oliveira', 'Rossi', 'Ferrari', 'Romano', 'Müller', 'Schmidt', 'Weber', 'Wagner', 
  'Dubois', 'Moreau', 'Bernard', 'Van Dijk', 'De Jong', 'Tanaka', 'Suzuki', 'Kim', 'Park', 'Diallo', 
  'Toure', 'Traore', 'Coulibaly', 'Cisse', 'Mensah', 'Okafor', 'Diallo', 'Kebe', 'Sarr', 'Diallo',
  'Fernandes', 'Pereira', 'Costa', 'Ribeiro', 'Almeida', 'Carvalho', 'Gomes', 'Lints', 'Varga', 'Nagy',
  'Kovacs', 'Toth', 'Horvath', 'Popov', 'Petrov', 'Ivanov', 'Kowalski', 'Wisniewski', 'Wojcik', 'Kamel'
];

const positions: Position[] = ['GK', 'DEF', 'MID', 'ATT'];

const generateYouthAttributes = (position: Position, overall: number): PlayerAttributes => {
  const base = Math.max(1, overall - 10);
  const prime = Math.min(99, overall + 5);
  return {
    acceleration: rng(base, prime), sprintSpeed: rng(base, prime),
    attackingPosition: rng(base, prime), finishing: rng(base, prime), shotPower: rng(base, prime),
    longShots: rng(base, prime), volleys: rng(base, prime), penalties: rng(base, prime),
    vision: rng(base, prime), crossing: rng(base, prime), freeKickAccuracy: rng(base, prime),
    shortPass: rng(base, prime), longPass: rng(base, prime), curve: rng(base, prime),
    agility: rng(base, prime), balance: rng(base, prime), reactions: rng(base, prime),
    ballControl: rng(base, prime), composure: rng(base, prime),
    interceptions: rng(base, prime), headingAccuracy: rng(base, prime), defensiveAwareness: rng(base, prime),
    standTackle: rng(base, prime), slideTackle: rng(base, prime),
    jumping: rng(base, prime), stamina: rng(base, prime), strength: rng(base, prime), aggression: rng(base, prime)
  };
};

export const generateYouthProspect = (clubReputation: number): Player => {
  const firstName = firstNames[rng(0, firstNames.length - 1)];
  const lastName = lastNames[rng(0, lastNames.length - 1)];
  const position = positions[rng(0, positions.length - 1)];
  const age = rng(15, 18);

  const baseOverall = rng(50, 62) + Math.floor(clubReputation / 200);
  const overall = Math.min(70, baseOverall);
  const potential = Math.min(92, overall + rng(12, 25));

  return {
    id: `youth-${Date.now()}-${rng(100, 999)}`,
    name: `${firstName} ${lastName}`,
    nationality: 'Unknown',
    birthDate: `${2026 - age}-01-01`,
    age,
    effectiveCareerAge: age,
    position,
    attributes: generateYouthAttributes(position, overall),
    overall,
    potential,
    value: overall * 15000,
    form: 70,
    fitness: 100,
    contract: { wage: rng(500, 2000), expiringYear: 2029 },
    stats: { goals: 0, assists: 0, shots: 0, shotsOnTarget: 0, xG: 0, xA: 0, possession: 0, passesCompleted: 0, keyPasses: 0, tackles: 0, interceptions: 0, saves: 0, yellowCards: 0, redCards: 0, appearances: 0, minutesPlayed: 0, cleanSheets: 0, rating: 0 },
    historicalStats: [],
    injuryProfile: { overallResistance: rng(70, 95), muscleResistance: rng(70, 95), ligamentResistance: rng(70, 95), history: [], workload30Days: 0 },
    milestones: []
  };
};

export const scoutYouthAcademy = (club: Club, currentDate: string): { updatedClub: Club, newProspect: Player | null, message: string } => {
  const today = new Date(currentDate);
  const lastScouted = club.lastYouthScoutDate ? new Date(club.lastYouthScoutDate) : null;

  if (lastScouted) {
    const diffTime = Math.abs(today.getTime() - lastScouted.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) {
      return {
        updatedClub: club,
        newProspect: null,
        message: `Youth Academy is still scouting. Next prospect available in ${30 - diffDays} days.`
      };
    }
  }

  const newProspect = generateYouthProspect(club.reputation || 50);

  const updatedClub: Club = {
    ...club,
    players: [...club.players, newProspect],
    lastYouthScoutDate: currentDate
  };

  return {
    updatedClub,
    newProspect,
    message: `Successfully signed youth prospect ${newProspect.name} (${newProspect.position}, OVR: ${newProspect.overall})!`
  };
};
