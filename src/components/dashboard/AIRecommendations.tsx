import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Moon, Droplets, Dumbbell, Heart } from "lucide-react";
import { LucideIcon } from "lucide-react";

interface Recommendation {
  icon: LucideIcon;
  title: string;
  description: string;
  category: string;
}

export function AIRecommendations() {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);

  useEffect(() => {
    if (!user) return;
    generateRecommendations();
  }, [user]);

  const generateRecommendations = async () => {
    if (!user) return;

    const { data: entries } = await supabase
      .from("health_entries")
      .select("*")
      .eq("user_id", user.id)
      .order("entry_date", { ascending: false })
      .limit(7);

    const recs: Recommendation[] = [];

    if (!entries || entries.length === 0) {
      recs.push({
        icon: Heart,
        title: "Start Tracking",
        description: "Log your first daily health entry to get personalized recommendations.",
        category: "getting-started",
      });
      setRecommendations(recs);
      return;
    }

    const avgSleep = entries.reduce((a, e) => a + (e.sleep_hours || 0), 0) / entries.length;
    const avgWater = entries.reduce((a, e) => a + (e.water_intake_ml || 0), 0) / entries.length;
    const avgSteps = entries.reduce((a, e) => a + (e.steps || 0), 0) / entries.length;
    const avgExercise = entries.reduce((a, e) => a + (e.exercise_minutes || 0), 0) / entries.length;
    const avgStress = entries.reduce((a, e) => a + (e.stress_level || 5), 0) / entries.length;

    if (avgSleep < 7) {
      recs.push({
        icon: Moon,
        title: "Improve Your Sleep",
        description: `You're averaging ${avgSleep.toFixed(1)}h of sleep. Try setting a consistent bedtime, avoiding screens 1h before bed, and keeping your room cool and dark.`,
        category: "sleep",
      });
    } else if (avgSleep >= 7 && avgSleep <= 9) {
      recs.push({
        icon: Moon,
        title: "Great Sleep Habits!",
        description: `You're averaging ${avgSleep.toFixed(1)}h of sleep — keep it up! Maintain your consistent sleep schedule.`,
        category: "sleep",
      });
    }

    if (avgWater < 2000) {
      recs.push({
        icon: Droplets,
        title: "Hydrate More",
        description: `You're drinking about ${(avgWater / 1000).toFixed(1)}L daily. Aim for 2.5L+. Try carrying a water bottle and setting hourly reminders.`,
        category: "hydration",
      });
    }

    if (avgSteps < 8000) {
      recs.push({
        icon: Dumbbell,
        title: "Move More",
        description: `${Math.round(avgSteps).toLocaleString()} steps/day is below the 8,000 target. Take short walks after meals and use stairs instead of elevators.`,
        category: "activity",
      });
    }

    if (avgExercise < 30) {
      recs.push({
        icon: Dumbbell,
        title: "Increase Exercise",
        description: `You're exercising ${Math.round(avgExercise)} min/day on average. Start with 15-min sessions and gradually increase to 30+ minutes.`,
        category: "exercise",
      });
    }

    if (avgStress > 6) {
      recs.push({
        icon: Heart,
        title: "Manage Stress",
        description: "Your stress levels are elevated. Consider meditation, deep breathing exercises, or journaling to help manage daily stress.",
        category: "mental",
      });
    }

    if (recs.length === 0) {
      recs.push({
        icon: Sparkles,
        title: "You're Doing Great!",
        description: "Your health metrics are looking excellent. Keep maintaining your healthy habits!",
        category: "general",
      });
    }

    setRecommendations(recs);
  };

  return (
    <Card className="glass-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-display flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-accent" />
          AI Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {recommendations.map((rec, i) => (
          <div key={i} className="p-3 rounded-lg bg-secondary/50 space-y-1">
            <div className="flex items-center gap-2">
              <rec.icon className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold text-foreground">{rec.title}</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">{rec.description}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
