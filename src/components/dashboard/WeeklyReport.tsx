import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { subDays, format } from "date-fns";
import { FileText, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface WeeklyStats {
  avgSleep: number;
  avgSteps: number;
  avgWater: number;
  avgExercise: number;
  avgScore: number;
  daysLogged: number;
  exerciseDays: number;
}

export function WeeklyReport() {
  const { user } = useAuth();
  const [stats, setStats] = useState<WeeklyStats | null>(null);
  const [prevStats, setPrevStats] = useState<WeeklyStats | null>(null);

  const calcStats = (entries: any[]): WeeklyStats => {
    const n = entries.length;
    if (n === 0) return { avgSleep: 0, avgSteps: 0, avgWater: 0, avgExercise: 0, avgScore: 0, daysLogged: 0, exerciseDays: 0 };
    return {
      avgSleep: Math.round((entries.reduce((a, e) => a + (e.sleep_hours || 0), 0) / n) * 10) / 10,
      avgSteps: Math.round(entries.reduce((a, e) => a + (e.steps || 0), 0) / n),
      avgWater: Math.round(entries.reduce((a, e) => a + (e.water_intake_ml || 0), 0) / n),
      avgExercise: Math.round(entries.reduce((a, e) => a + (e.exercise_minutes || 0), 0) / n),
      avgScore: Math.round(entries.reduce((a, e) => a + (e.health_score || 0), 0) / n),
      daysLogged: n,
      exerciseDays: entries.filter((e) => (e.exercise_minutes || 0) > 0).length,
    };
  };

  useEffect(() => {
    if (!user) return;
    const now = new Date();
    const weekAgo = subDays(now, 7).toISOString().split("T")[0];
    const twoWeeksAgo = subDays(now, 14).toISOString().split("T")[0];

    Promise.all([
      supabase.from("health_entries").select("*").eq("user_id", user.id).gte("entry_date", weekAgo),
      supabase.from("health_entries").select("*").eq("user_id", user.id).gte("entry_date", twoWeeksAgo).lt("entry_date", weekAgo),
    ]).then(([current, previous]) => {
      if (current.data) setStats(calcStats(current.data));
      if (previous.data) setPrevStats(calcStats(previous.data));
    });
  }, [user]);

  if (!stats) return null;

  const TrendIcon = ({ current, previous }: { current: number; previous: number }) => {
    if (current > previous) return <TrendingUp className="h-3.5 w-3.5 text-success" />;
    if (current < previous) return <TrendingDown className="h-3.5 w-3.5 text-destructive" />;
    return <Minus className="h-3.5 w-3.5 text-muted-foreground" />;
  };

  const metrics = [
    { label: "Avg Sleep", value: `${stats.avgSleep}h`, prev: prevStats?.avgSleep || 0, current: stats.avgSleep },
    { label: "Avg Steps", value: stats.avgSteps.toLocaleString(), prev: prevStats?.avgSteps || 0, current: stats.avgSteps },
    { label: "Avg Water", value: `${(stats.avgWater / 1000).toFixed(1)}L`, prev: prevStats?.avgWater || 0, current: stats.avgWater },
    { label: "Exercise Days", value: `${stats.exerciseDays}/7`, prev: prevStats?.exerciseDays || 0, current: stats.exerciseDays },
    { label: "Health Score", value: `${stats.avgScore}/100`, prev: prevStats?.avgScore || 0, current: stats.avgScore },
    { label: "Days Logged", value: `${stats.daysLogged}/7`, prev: prevStats?.daysLogged || 0, current: stats.daysLogged },
  ];

  return (
    <Card className="glass-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-display flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          Weekly Report
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          {format(subDays(new Date(), 7), "MMM d")} – {format(new Date(), "MMM d, yyyy")}
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {metrics.map(({ label, value, prev, current }) => (
            <div key={label} className="space-y-1 p-3 rounded-lg bg-secondary/50">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{label}</p>
              <div className="flex items-center gap-2">
                <span className="text-lg font-display font-bold text-foreground">{value}</span>
                <TrendIcon current={current} previous={prev} />
              </div>
            </div>
          ))}
        </div>

        {stats.avgScore < 50 && (
          <div className="mt-4 p-3 rounded-lg bg-warning/10 border border-warning/20">
            <p className="text-xs text-foreground font-medium">Areas to improve:</p>
            <ul className="text-xs text-muted-foreground mt-1 space-y-0.5">
              {stats.avgSleep < 7 && <li>• Try to get at least 7 hours of sleep</li>}
              {stats.avgWater < 2000 && <li>• Increase water intake to 2L+</li>}
              {stats.exerciseDays < 3 && <li>• Aim for exercise at least 3 days/week</li>}
              {stats.avgSteps < 5000 && <li>• Try to walk at least 5,000 steps daily</li>}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
