import { getHealthStatus } from "@/lib/health-score";

interface HealthScoreRingProps {
  score: number;
  size?: number;
}

export function HealthScoreRing({ score, size = 180 }: HealthScoreRingProps) {
  const status = getHealthStatus(score);
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: size, height: size }}>
        <svg viewBox="0 0 100 100" className="transform -rotate-90" width={size} height={size}>
          <circle cx="50" cy="50" r={radius} fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke={status.color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="health-score-ring transition-all duration-1000"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-display font-bold text-foreground">{score}</span>
          <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Score</span>
        </div>
      </div>
      <div className="text-center">
        <span className="text-sm font-semibold" style={{ color: status.color }}>{status.label}</span>
        <p className="text-xs text-muted-foreground mt-1 max-w-[220px]">{status.description}</p>
      </div>
    </div>
  );
}
