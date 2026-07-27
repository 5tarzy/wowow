import { Player } from "../types";
const injuries=[
 ["Hamstring strain","Minor",1,5],["Ankle sprain","Moderate",2,8],["Muscle fatigue","Minor",1,3],
 ["Knee ligament injury","Serious",8,15],["ACL tear","Severe",24,35],["Concussion","Moderate",1,6]
] as const;
export class InjuryEngine {
  static risk(player:Player,workload:number):number {
    const age=Math.max(0,(player.age-28)*1.5);
    const fitness=Math.max(0,(70-player.fitness)*.8);
    return Math.min(40,2+age+fitness+workload*.12);
  }
  static maybeInjure(player:Player,workload:number):Player {
    if(player.injury||Math.random()*100>this.risk(player,workload)) return player;
    const x=injuries[Math.floor(Math.random()*injuries.length)];
    return {...player,injury:{type:x[0],severity:x[1],weeksRemaining:x[2],recurrenceRisk:x[3],diagnosed:true},fitness:Math.max(20,player.fitness-20)};
  }
  static recover(player:Player):Player {
    if(!player.injury) return player;
    const weeks=player.injury.weeksRemaining-1;
    if(weeks<=0) return {...player,injury:undefined,fitness:Math.min(100,player.fitness+15),form:Math.max(0,player.form-5)};
    return {...player,injury:{...player.injury,weeksRemaining:weeks}};
  }
}