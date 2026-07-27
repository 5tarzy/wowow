// Find your Club interface and add lastYouthScoutDate?: string; inside it:
export interface Club {
  id: string;
  name: string;
  shortName: string;
  country: string;
  league: string;
  reputation: number; // 1-100
  
  // Financials
  balance: number;
  wageBudget: number;
  transferBudget: number;
  
  // Infrastructure
  facilitiesRating: number;
  academyRating: number;
  medicalStaffRating: number;
  
  // Roster
  players: Player[];
  staff: Staff[];
  
  // AI Directives & CoolDowns
  aiControlled: boolean;
  transferPolicy: 'Aggressive' | 'Youth' | 'Balanced' | 'Veteran';
  lastYouthScoutDate?: string; // <-- ADD THIS LINE
}
