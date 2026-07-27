import { Club, League, NationalTeam, Tournament, Player } from "../types";

const a=(pace:number,finishing:number,passing:number,dribbling:number,defending:number,stamina:number,strength:number):Player["attributes"]=>({
  pace, acceleration:pace, finishing, passing, vision:passing, dribbling,
  ballControl:dribbling, defending, tackling:defending, positioning:passing,
  stamina, strength, composure:Math.round((finishing+passing)/2), reactions:80
});
const p=(id:string,name:string,age:number,nationality:string,position:Player["position"],overall:number,potential:number,value:number):Player=>({
  id,name,age,birthDate:`${1990+age}-01-01`,nationality,position,overall,potential,form:75,fitness:95,value,
  attributes:a(position==="ATT"?88:70,position==="ATT"?88:50,position==="MID"?90:65,position==="ATT"?88:55,position==="DEF"?88:40,82,position==="DEF"?84:65),
  goals:0,assists:0,appearances:0,contract:{wage:100000,expires:"2030-06-30",squadStatus:overall>=85?"Star":overall>=78?"First Team":"Rotation"}
});
export const worldClubs:Club[]=[
 {id:"mun",name:"Manchester United",shortName:"MUN",country:"England",league:"Premier League",reputation:91,balance:214500000,wageBudget:3500000,aiControlled:false,transferPolicy:"Win Now",players:[
  p("mun1","Andre Onana",30,"Cameroon","GK",84,85,28000000),p("mun2","Matthijs de Ligt",26,"Netherlands","DEF",86,88,58000000),
  p("mun3","Bruno Fernandes",31,"Portugal","MID",89,89,72000000),p("mun4","Amad Diallo",24,"Ivory Coast","ATT",82,90,46000000),
  p("mun5","Benjamin Sesko",23,"Slovenia","ATT",86,94,88000000),p("mun6","Kobbie Mainoo",21,"England","MID",84,92,70000000),
  p("mun7","Lisandro Martinez",28,"Argentina","DEF",87,88,65000000),p("mun8","Mason Mount",27,"England","MID",81,84,42000000),
  p("mun9","Luke Shaw",31,"England","DEF",80,81,26000000),p("mun10","Rasmus Hojlund",23,"Denmark","ATT",83,91,70000000),
  p("mun11","Diogo Dalot",27,"Portugal","DEF",82,85,38000000),p("mun12","Altay Bayindir",28,"Turkey","GK",77,80,12000000)
 ]},
 {id:"mci",name:"Manchester City",shortName:"MCI",country:"England",league:"Premier League",reputation:96,balance:450000000,wageBudget:5000000,aiControlled:true,transferPolicy:"Win Now",players:[]},
 {id:"ars",name:"Arsenal",shortName:"ARS",country:"England",league:"Premier League",reputation:92,balance:250000000,wageBudget:3000000,aiControlled:true,transferPolicy:"Balanced",players:[]},
 {id:"liv",name:"Liverpool",shortName:"LIV",country:"England",league:"Premier League",reputation:93,balance:310000000,wageBudget:3200000,aiControlled:true,transferPolicy:"Win Now",players:[]},
 {id:"che",name:"Chelsea",shortName:"CHE",country:"England",league:"Premier League",reputation:89,balance:280000000,wageBudget:3000000,aiControlled:true,transferPolicy:"Youth Development",players:[]},
 {id:"bay",name:"Bayern Munich",shortName:"BAY",country:"Germany",league:"Bundesliga",reputation:95,balance:360000000,wageBudget:4000000,aiControlled:true,transferPolicy:"Win Now",players:[]},
 {id:"rma",name:"Real Madrid",shortName:"RMA",country:"Spain",league:"La Liga",reputation:98,balance:550000000,wageBudget:6000000,aiControlled:true,transferPolicy:"Win Now",players:[]},
 {id:"bar",name:"Barcelona",shortName:"BAR",country:"Spain",league:"La Liga",reputation:94,balance:220000000,wageBudget:3500000,aiControlled:true,transferPolicy:"Youth Development",players:[]},
 {id:"psg",name:"Paris Saint-Germain",shortName:"PSG",country:"France",league:"Ligue 1",reputation:94,balance:480000000,wageBudget:5500000,aiControlled:true,transferPolicy:"Win Now",players:[]},
 {id:"int",name:"Inter Milan",shortName:"INT",country:"Italy",league:"Serie A",reputation:90,balance:210000000,wageBudget:2600000,aiControlled:true,transferPolicy:"Balanced",players:[]}
];

export const leagues:League[]=[
 {id:"eng1",name:"Premier League",country:"England",level:1,currentSeason:2026,clubs:["mun","mci","ars","liv","che"],table:[]},
 {id:"ger1",name:"Bundesliga",country:"Germany",level:1,currentSeason:2026,clubs:["bay"],table:[]},
 {id:"esp1",name:"La Liga",country:"Spain",level:1,currentSeason:2026,clubs:["rma","bar"],table:[]},
 {id:"fra1",name:"Ligue 1",country:"France",level:1,currentSeason:2026,clubs:["psg"],table:[]},
 {id:"ita1",name:"Serie A",country:"Italy",level:1,currentSeason:2026,clubs:["int"],table:[]}
];

export const nationalTeams:NationalTeam[]=[
 {name:"Argentina",code:"ARG",ranking:1,manager:"National Manager",players:[],wins:0,draws:0,losses:0},
 {name:"France",code:"FRA",ranking:2,manager:"National Manager",players:[],wins:0,draws:0,losses:0},
 {name:"Brazil",code:"BRA",ranking:3,manager:"National Manager",players:[],wins:0,draws:0,losses:0},
 {name:"England",code:"ENG",ranking:4,manager:"National Manager",players:[],wins:0,draws:0,losses:0},
 {name:"Portugal",code:"POR",ranking:7,manager:"National Manager",players:["Bruno Fernandes"],wins:0,draws:0,losses:0},
 {name:"Spain",code:"ESP",ranking:8,manager:"National Manager",players:[],wins:0,draws:0,losses:0},
 {name:"Germany",code:"GER",ranking:10,manager:"National Manager",players:[],wins:0,draws:0,losses:0}
];

export const tournaments:Tournament[]=[
 {id:"wc2030",name:"FIFA World Cup",year:2030,type:"World Cup",startDate:"2030-06-08",endDate:"2030-07-08",teams:["ARG","FRA","BRA","ENG","POR","ESP","GER"]},
 {id:"u20-2027",name:"FIFA U20 World Cup",year:2027,type:"U20 World Cup",startDate:"2027-06-01",endDate:"2027-06-30",teams:["ARG","FRA","BRA","ENG","POR","ESP","GER"]},
 {id:"euro2028",name:"European Championship",year:2028,type:"Continental Championship",startDate:"2028-06-10",endDate:"2028-07-10",teams:["FRA","ENG","POR","ESP","GER"]},
 {id:"wcq",name:"World Cup Qualification",year:2028,type:"Qualification",startDate:"2028-09-01",endDate:"2029-11-30",teams:["ARG","FRA","BRA","ENG","POR","ESP","GER"]}
];