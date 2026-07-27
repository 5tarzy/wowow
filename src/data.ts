import { Club, Fixture, NationalTeam, Player } from "./types";

const attrs = (pace:number, finishing:number, passing:number, dribbling:number, defending:number, stamina:number, strength:number): Player["attributes"] => ({
  pace, acceleration: pace, finishing, passing, vision: passing, dribbling,
  ballControl: dribbling, defending, tackling: defending, positioning: passing,
  stamina, strength, composure: Math.round((finishing + passing) / 2), reactions: 80
});

export const players: Player[] = [
  { id:"p1", name:"Andre Onana", age:30, nationality:"Cameroon", position:"GK", overall:84, potential:85, form:78, fitness:94, value:28000000, attributes:attrs(62,45,72,40,50,75,78), goals:0, assists:0, appearances:0 },
  { id:"p2", name:"Matthijs de Ligt", age:26, nationality:"Netherlands", position:"DEF", overall:86, potential:88, form:82, fitness:91, value:58000000, attributes:attrs(65,35,78,50,88,80,90), goals:1, assists:0, appearances:0 },
  { id:"p3", name:"Bruno Fernandes", age:31, nationality:"Portugal", position:"MID", overall:89, potential:89, form:91, fitness:96, value:72000000, attributes:attrs(70,82,94,86,55,88,62), goals:0, assists:0, appearances:0 },
  { id:"p4", name:"Amad Diallo", age:24, nationality:"Ivory Coast", position:"ATT", overall:82, potential:90, form:86, fitness:92, value:46000000, attributes:attrs(90,76,78,91,35,84,55), goals:0, assists:0, appearances:0 },
  { id:"p5", name:"Benjamin Sesko", age:23, nationality:"Slovenia", position:"ATT", overall:86, potential:94, form:88, fitness:95, value:88000000, attributes:attrs(88,90,68,77,35,82,86), goals:0, assists:0, appearances:0 }
];

export const demoClub: Club = {
  id:"club-demo", name:"Manchester United", shortName:"MUN", country:"England",
  league:"Premier League", reputation:91, balance:214500000, players
};

export const fixtures: Fixture[] = [
  { id:"f1", opponent:"Aston Villa", competition:"Premier League", type:"League", date:"2026-08-08", home:true },
  { id:"f2", opponent:"Arsenal", competition:"Premier League", type:"League", date:"2026-08-15", home:false },
  { id:"f3", opponent:"Bayern Munich", competition:"Champions League", type:"Continental", date:"2026-08-19", home:true },
  { id:"f4", opponent:"Liverpool", competition:"Premier League", type:"League", date:"2026-08-23", home:true },
  { id:"f5", opponent:"Chelsea", competition:"Premier League", type:"League", date:"2026-08-30", home:false },
  { id:"f6", opponent:"Manchester City", competition:"Premier League", type:"League", date:"2026-09-06", home:true }
];

export const nationalTeams: NationalTeam[] = [
  { name:"England", code:"ENG", ranking:4, manager:"National Manager", players:["Harry Kane","Jude Bellingham"], wins:0, draws:0, losses:0 },
  { name:"Portugal", code:"POR", ranking:7, manager:"National Manager", players:["Bruno Fernandes"], wins:0, draws:0, losses:0 },
  { name:"Brazil", code:"BRA", ranking:3, manager:"National Manager", players:[], wins:0, draws:0, losses:0 },
  { name:"France", code:"FRA", ranking:2, manager:"National Manager", players:[], wins:0, draws:0, losses:0 },
  { name:"Argentina", code:"ARG", ranking:1, manager:"National Manager", players:[], wins:0, draws:0, losses:0 }
];