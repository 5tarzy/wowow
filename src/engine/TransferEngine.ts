import { Club, Player, TransferOffer } from "../types";
export class TransferEngine {
  static fairValue(player:Player,marketInflation=1):number {
    const ageFactor=player.age<=21?1.5:player.age<=26?1.25:player.age>=31?.55:1;
    const formFactor=.7+player.form/100*.6;
    const potentialFactor=.8+player.potential/100*.7;
    return Math.round(player.value*ageFactor*formFactor*potentialFactor*marketInflation);
  }
  static evaluateOffer(player:Player,offer:TransferOffer):"Accept"|"Reject" {
    const value=this.fairValue(player);
    return offer.fee>=value*.9?"Accept":"Reject";
  }
  static aiTransfer(clubs:Club[],season:number):TransferOffer[] {
    const offers:TransferOffer[]=[];
    for(const buyer of clubs.filter(c=>c.aiControlled)){
      const need=buyer.players.length<15;
      if(!need) continue;
      const seller=clubs.find(c=>c.id!==buyer.id&&c.players.length>0);
      const player=seller?.players.find(p=>p.age<=27);
      if(player&&seller) offers.push({id:`offer-${season}-${buyer.id}-${player.id}`,playerId:player.id,fromClubId:seller.id,toClubId:buyer.id,fee:this.fairValue(player),wage:player.contract.wage*1.2,status:"Negotiating"});
    }
    return offers;
  }
}