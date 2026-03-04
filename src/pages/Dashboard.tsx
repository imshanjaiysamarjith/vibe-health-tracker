import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { HealthScoreRing } from "@/components/dashboard/HealthScoreRing";
import { StatCard } from "@/components/dashboard/StatCard";
import { AIRecommendations } from "@/components/dashboard/AIRecommendations";
import { HabitTracker } from "@/components/dashboard/HabitTracker";
import { WeeklyReport } from "@/components/dashboard/WeeklyReport";
import { Moon, Droplets, Footprints, Flame, Dumbbell, Monitor } from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();
  const [todayEntry, setTodayEntry] = useState<any>(null);

  useEffect(() => {
    if (!user) return;
    const today = new Date().toISOString().split("T")[0];
    supabase
      .from("health_entries")
      .select("*")
      .eq("user_id", user.id)
      .eq("entry_date", today)
      .maybeSingle()
      .then(({ data }) => setTodayEntry(data));
  }, [user]);

  const score = todayEntry?.health_score || 0;

  const stats = [
    { title: "Sleep", value: todayEntry?.sleep_hours ?? "—", unit: "hrs", icon: Moon },
    { title: "Water", value: todayEntry?.water_intake_ml ? `${(todayEntry.water_intake_ml / 1000).toFixed(1)}` : "—", unit: "L", icon: Droplets },
    { title: "Steps", value: todayEntry?.steps?.toLocaleString() ?? "—", icon: Footprints },
    { title: "Calories", value: todayEntry?.calories_consumed?.toLocaleString() ?? "—", unit: "kcal", icon: Flame },
    { title: "Exercise", value: todayEntry?.exercise_minutes ?? "—", unit: "min", icon: Dumbbell },
    { title: "Screen", value: todayEntry?.screen_time_minutes ?? "—", unit: "min", icon: Monitor },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Your health overview for today</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Health Score */}
        <div className="lg:col-span-1 flex justify-center">
          <div className="glass-card rounded-2xl p-6 w-full flex justify-center">
            <HealthScoreRing score={score} />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="lg:col-span-2">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {stats.map((stat) => (
              <StatCard key={stat.title} {...stat} />
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <HabitTracker />
        <AIRecommendations />
      </div>

      <WeeklyReport />
    </div>
  );
}
