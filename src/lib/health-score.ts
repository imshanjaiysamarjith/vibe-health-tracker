export interface HealthData {
  sleep_hours?: number | null;
  water_intake_ml?: number | null;
  steps?: number | null;
  calories_consumed?: number | null;
  exercise_minutes?: number | null;
  screen_time_minutes?: number | null;
  stress_level?: number | null;
}

export function calculateHealthScore(data: HealthData): number {
  let score = 0;
  let factors = 0;

  // Sleep (0-25 points) - optimal 7-9 hours
  if (data.sleep_hours != null) {
    const sleep = data.sleep_hours;
    if (sleep >= 7 && sleep <= 9) score += 25;
    else if (sleep >= 6 && sleep < 7) score += 18;
    else if (sleep > 9 && sleep <= 10) score += 18;
    else if (sleep >= 5) score += 10;
    else score += 5;
    factors++;
  }

  // Hydration (0-20 points) - target 2500ml+
  if (data.water_intake_ml != null) {
    const water = data.water_intake_ml;
    if (water >= 2500) score += 20;
    else if (water >= 2000) score += 16;
    else if (water >= 1500) score += 12;
    else if (water >= 1000) score += 8;
    else score += 4;
    factors++;
  }

  // Steps (0-20 points) - target 8000+
  if (data.steps != null) {
    const steps = data.steps;
    if (steps >= 10000) score += 20;
    else if (steps >= 8000) score += 17;
    else if (steps >= 5000) score += 13;
    else if (steps >= 3000) score += 8;
    else score += 4;
    factors++;
  }

  // Exercise (0-20 points) - target 30min+
  if (data.exercise_minutes != null) {
    const ex = data.exercise_minutes;
    if (ex >= 60) score += 20;
    else if (ex >= 30) score += 16;
    else if (ex >= 15) score += 10;
    else if (ex > 0) score += 5;
    factors++;
  }

  // Stress (0-15 points) - lower is better
  if (data.stress_level != null) {
    const stress = data.stress_level;
    if (stress <= 2) score += 15;
    else if (stress <= 4) score += 12;
    else if (stress <= 6) score += 8;
    else if (stress <= 8) score += 4;
    else score += 2;
    factors++;
  }

  if (factors === 0) return 0;
  // Normalize to 0-100
  const maxPossible = factors === 5 ? 100 : factors * 20;
  return Math.round((score / maxPossible) * 100);
}

export function getHealthStatus(score: number): { label: string; color: string; description: string } {
  if (score >= 85) return { label: "Excellent", color: "hsl(var(--success))", description: "You're doing amazing! Keep up these healthy habits." };
  if (score >= 70) return { label: "Good", color: "hsl(var(--primary))", description: "Great progress! A few small tweaks could boost your score." };
  if (score >= 50) return { label: "Fair", color: "hsl(var(--warning))", description: "Room for improvement. Focus on sleep and hydration." };
  if (score >= 30) return { label: "Needs Work", color: "hsl(var(--accent))", description: "Let's work on building healthier daily habits." };
  return { label: "Critical", color: "hsl(var(--destructive))", description: "Your health metrics need attention. Start with small changes." };
}
