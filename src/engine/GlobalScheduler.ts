import { Fixture, Tournament } from "../types";

export class GlobalScheduler {
  static internationalWindow(date:string):boolean {
    const month=Number(date.slice(5,7));
    return [3,6,9,10,11].includes(month);
  }
  static isTournamentActive(date:string,tournaments:Tournament[]):Tournament|undefined {
    return tournaments.find(t=>date>=t.startDate&&date<=t.endDate);
  }
  static canScheduleFixture(date:string,existing:Fixture[]):boolean {
    const day=new Date(date);
    const recent=existing.filter(f=>Math.abs(new Date(f.date).getTime()-day.getTime())<4*86400000);
    return recent.length<2 && !this.internationalWindow(date);
  }
  static generateLeagueFixtures(clubIds:string[],season:number):Fixture[] {
    const out:Fixture[]=[]; let id=0;
    for(let i=0;i<clubIds.length;i++) for(let j=i+1;j<clubIds.length;j++){
      const month=8+Math.floor(id/4); const day=1+(id%4)*7;
      const date=`${season}-${String(Math.min(month,12)).padStart(2,"0")}-${String(Math.min(day,28)).padStart(2,"0")}`;
      out.push({id:`league-${season}-${id++}`,homeClubId:clubIds[i],awayClubId:clubIds[j],home:clubIds[i],away:clubIds[j],competition:"League",type:"League",date});
      out.push({id:`league-${season}-${id++}`,homeClubId:clubIds[j],awayClubId:clubIds[i],home:clubIds[j],away:clubIds[i],competition:"League",type:"League",date:`${season+1}-01-${String(5+(id%20)).padStart(2,"0")}`});
    }
    return out;
  }
}