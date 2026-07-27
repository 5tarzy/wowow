export type Position = "GK" | "DEF" | "MID" | "ATT";
export type CompetitionType = "League" | "Domestic Cup" | "Continental" | "International" | "Youth";

export interface Attributes {
  pace:number; acceleration:number; finishing:number; passing:number; vision:number;
  dribbling:number; ballControl:number; defending:number; tackling:number;
  positioning:number; stamina:number; strength:number; composure:number; reactions:number;
}

export interface Contract {
  wage:number; expires:string; squadStatus:"Star"|"First Team"|"Rotation"|"Prospect";
  releaseClause?:number;
}

export interface Injury {
  type:string; severity:"Minor"|"Moderate"|"Serious"|"Severe";
  weeksRemaining:number; recurrenceRisk:number; diagnosed:boolean;
}

export interface Player {
  id:string; name:string; age:number; birthDate:string; nationality:string; position:Position;
  overall:number; potential:number; form:number; fitness:number; value:number;
  attributes:Attributes; goals:number; assists:number; appearances:number;
  contract:Contract; injury?:Injury; retired?:boolean; academyProduct?:boolean;
}

export interface Club {
  id:string; name:string; shortName:string; country:string; league:string; reputation:number;
  balance:number; wageBudget:number; players:Player[]; aiControlled:boolean;
  transferPolicy:"Win Now"|"Youth Development"|"Balanced";
}

export interface League {
  id:string; name:string; country:string; level:number; clubs:string[];
  currentSeason:number; table:LeagueTableRow[];
}

export interface LeagueTableRow {
  clubId:string; played:number; wins:number; draws:number; losses:number;
  goalsFor:number; goalsAgainst:number; points:number;
}

export interface Fixture {
  id:string; homeClubId:string; awayClubId:string; home:string; away:string;
  competition:string; type:CompetitionType; date:string; result?:string; xg?:string;
}

export interface TransferOffer {
  id:string; playerId:string; fromClubId:string; toClubId:string;
  fee:number; wage:number; status:"Listed"|"Negotiating"|"Accepted"|"Rejected"|"Completed";
}

export interface NationalTeam {
  name:string; code:string; ranking:number; manager:string; players:string[];
  wins:number; draws:number; losses:number;
}

export interface Tournament {
  id:string; name:string; year:number; type:"World Cup"|"U20 World Cup"|"Continental Championship"|"Qualification";
  startDate:string; endDate:string; teams:string[];
}

export interface SaveState {
  currentDate:string; club:Club; clubs:Club[]; leagues:League[]; fixtures:Fixture[];
  nationalTeams:NationalTeam[]; tournaments:Tournament[]; transferOffers:TransferOffer[];
  news:string[]; season:number;
}