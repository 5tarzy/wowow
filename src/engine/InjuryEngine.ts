import { Player, InjuryRecord, InjurySeverity } from '../types';

const rng = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const rngFloat = (min: number, max: number) => (Math.random() * (max - min) + min);

// Detailed injury categories (Requirement #12)
const injuryTypes = [
  'Hamstring Strain', 'Calf Strain', 'Groin Strain', 'Muscle Tear', // Muscle
  'ACL Tear', 'MCL Injury', 'Ankle Sprain', // Ligament/Joint
  'Fractured Metatarsal', 'Broken Collarbone', // Bone
  'Concussion', // Head
  'Flu', 'Viral Infection' // Illness
];

// Determine how bad the injury is and how long they are out (Requirement #13)
const getSeverity = (): { severity: InjurySeverity, weeks: number } => {
  const roll = rng(1, 100);
  if (roll > 98) return { severity: 'Career-Threatening', weeks: rng(36, 52) };
  if (roll > 90) return { severity: 'Severe', weeks: rng(16, 35) };
  if (roll > 75) return { severity: 'Serious', weeks: rng(6, 15) };
  if (roll > 40) return { severity: 'Moderate', weeks: rng(2, 5) };
  return { severity: 'Minor', weeks: 1 };
};

// Drain player stamina based on minutes played and age (Requirements #14 & #15)
export const processMatchFatigue = (player: Player, minutesPlayed: number): Player => {
  let fitnessDrop = (minutesPlayed / 90) * rngFloat(4.0, 8.0);
  
  // Older players or injury-prone players lose more fitness
  if (player.age > 30) fitnessDrop *= 1.2;
  if (player.injuryProfile.overallResistance < 70) fitnessDrop *= 1.1;

  const newFitness = Math.max(0, player.fitness - fitnessDrop);
  
  return { ...player, fitness: parseFloat(newFitness.toFixed(1)) };
};

// Calculate if a player gets hurt during a match (Requirement #14 & #17)
export const evaluateInjuryRisk = (player: Player, currentDate: string, matchIntensity: number = 1.0): Player => {
  if (player.injuryProfile.currentInjury) return player; // Already hurt

  // Lower fitness = exponentially higher injury risk
  const fatigueFactor = (100 - player.fitness) / 100; // 0 to 1
  const resistanceFactor = (100 - player.injuryProfile.overallResistance) / 100; // 0 to 1
  
  // Base chance per match is around 2%, scaling up rapidly with extreme fatigue
  const injuryChance = (0.02 + (fatigueFactor * 0.05) + (resistanceFactor * 0.03)) * matchIntensity;
  
  const rolledInjury = Math.random() < injuryChance;

  if (rolledInjury) {
    const { severity, weeks } = getSeverity();
    const type = injuryTypes[rng(0, injuryTypes.length - 1)];
    
    // Medical diagnosis can be slightly off from actual recovery time (Requirement #20)
    const diagnosisVariance = severity === 'Minor' ? 0 : rng(-1, 2); 

    const newInjury: InjuryRecord = {
      id: `inj-${Date.now()}-${rng(1000,9999)}`,
      type,
      severity,
      dateOccurred: currentDate,
      initialDiagnosisWeeks: Math.max(1, weeks + diagnosisVariance),
      confirmedRecoveryWeeks: weeks,
      recoveryStage: 'Medical Treatment',
      isRecurring: player.injuryProfile.history.some(i => i.type === type)
    };

    return {
      ...player,
      fitness: Math.max(0, player.fitness - 20), // Instant physical drop on injury occurrence
      form: Math.max(0, player.form - 10), // Morale drop
      injuryProfile: {
        ...player.injuryProfile,
        currentInjury: newInjury,
        history: [...player.injuryProfile.history, newInjury]
      }
    };
  }

  return player;
};

// Daily passive rest/recovery (Requirement #21)
export const processDailyRecovery = (player: Player): Player => {
  let updatedPlayer = { ...player };

  if (!updatedPlayer.injuryProfile.currentInjury && updatedPlayer.fitness < 100) {
     // Healthy players naturally recover fitness over time
     updatedPlayer.fitness = Math.min(100, updatedPlayer.fitness + rngFloat(1.5, 3.0));
  }
  
  // We will build out the week-to-week injury rehab logic when we build the Global Scheduler loop!
  return updatedPlayer;
};
