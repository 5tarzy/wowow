import { Club, MatchResult, MatchStats } from '../types';

const rng = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const rngFloat = (min: number, max: number) => (Math.random() * (max - min) + min);

const calculateTeamStrength = (team: Club) => {
  const starters = team.players.slice(0, 11);
  let attack = 0, midfield = 0, defense = 0, gk = 0;
  let attCount = 0, midCount = 0, defCount = 0;

  starters.forEach(p => {
    if (p.position === 'ATT' || p.position === 'WINGER') { attack += p.overall; attCount++; }
    else if (p.position === 'MID') { midfield += p.overall; midCount++; }
    else if (p.position === 'DEF') { defense += p.overall; defCount++; }
    else if (p.position === 'GK') { gk = p.overall; }
  });

  return {
    attack: attCount > 0 ? attack / attCount : 50,
    midfield: midCount > 0 ? midfield / midCount : 50,
    defense: defCount > 0 ? defense / defCount : 50,
    gk: gk || 50
  };
};

const initMatchStats = (): MatchStats => ({
  goals: 0, assists: 0, shots: 0, shotsOnTarget: 0, xG: 0, xA: 0,
  possession: 50, passesCompleted: 0, keyPasses: 0, tackles: 0,
  interceptions: 0, saves: 0, yellowCards: 0, redCards: 0
});

export const simulateMatch = (homeTeam: Club, awayTeam: Club, competition: string, date: string): MatchResult => {
  const homeStrength = calculateTeamStrength(homeTeam);
  const awayStrength = calculateTeamStrength(awayTeam);

  const homeStats = initMatchStats();
  const awayStats = initMatchStats();

  const totalMid = homeStrength.midfield + awayStrength.midfield;
  homeStats.possession = Math.round((homeStrength.midfield / totalMid) * 100);
  awayStats.possession = 100 - homeStats.possession;

  const homeAdvantage = 1.05;
  const homeChances = (homeStrength.attack * homeAdvantage) / awayStrength.defense;
  const awayChances = awayStrength.attack / (homeStrength.defense * homeAdvantage);

  homeStats.shots = Math.round(homeChances * rng(8, 15));
  awayStats.shots = Math.round(awayChances * rng(8, 15));

  homeStats.shotsOnTarget = Math.round(homeStats.shots * rngFloat(0.3, 0.6));
  awayStats.shotsOnTarget = Math.round(awayStats.shots * rngFloat(0.3, 0.6));

  homeStats.xG = parseFloat((homeStats.shotsOnTarget * rngFloat(0.1, 0.35)).toFixed(2));
  awayStats.xG = parseFloat((awayStats.shotsOnTarget * rngFloat(0.1, 0.35)).toFixed(2));

  const homeGoalProb = homeStats.xG / (awayStrength.gk / 50); 
  const awayGoalProb = awayStats.xG / (homeStrength.gk / 50);

  homeStats.goals = Math.round(homeGoalProb * rngFloat(0.7, 1.3));
  awayStats.goals = Math.round(awayGoalProb * rngFloat(0.7, 1.3));

  homeStats.saves = awayStats.shotsOnTarget - awayStats.goals;
  awayStats.saves = homeStats.shotsOnTarget - homeStats.goals;
  
  homeStats.passesCompleted = Math.round(homeStats.possession * rng(4, 7));
  awayStats.passesCompleted = Math.round(awayStats.possession * rng(4, 7));

  homeStats.tackles = rng(10, 25);
  awayStats.tackles = rng(10, 25);

  return {
    id: `match-${Date.now()}`,
    date,
    competition,
    homeTeamId: homeTeam.id,
    awayTeamId: awayTeam.id,
    homeScore: homeStats.goals,
    awayScore: awayStats.goals,
    homeStats,
    awayStats,
    events: []
  };
};
