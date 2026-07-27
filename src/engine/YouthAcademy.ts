import { Club, Player } from "../types";
const names=["Alex","Mateo","Liam","Noah","Ethan","Leo","Milan","Santiago","Kai","Adam"];
export class YouthAcademy {
  static generate(club:Club,year:number):Player {
    const position=["GK","DEF","MID","ATT"][Math.floor(Math.random()*4)] as Player["position"];
    const potential=Math.round(65+Math.random()*30+(club.reputation/100)*5);
    const overall=Math.round(45+Math.random()*25);
    const name=`${names[Math.floor(Math.random()*names.length)]} Academy`;
    return {id:`youth-${club.id}-${year}-${Math.random().toString(36).slice(2,8)}`,name,age:16,nationality:club.country,position,overall,potential,form:60,fitness:95,value:100000,attributes:{
      pace:50+Math.floor(Math.random()*35),acceleration:50+Math.floor(Math.random()*35),finishing:40+Math.floor(Math.random()*45),passing:45+Math.floor(Math.random()*40),vision:45+Math.floor(Math.random()*40),dribbling:45+Math.floor(Math.random()*45),ballControl:45+Math.floor(Math.random()*45),defending:40+Math.floor(Math.random()*45),tackling:40+Math.floor(Math.random()*45),positioning:40+Math.floor(Math.random()*45),stamina:50+Math.floor(Math.random()*35),strength:40+Math.floor(Math.random()*40),composure:40+Math.floor(Math.random()*40),reactions:50+Math.floor(Math.random()*35)
    },goals:0,assists:0,appearances:0,academyProduct:true,contract:{wage:5000,expires:`${year+3}-06-30`,squadStatus:"Prospect"}};
  }
}