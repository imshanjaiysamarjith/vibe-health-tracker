import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Plus, Flame, Target } from "lucide-react";

interface Habit {
  id: string;
  name: string;
  target_value: number | null;
  unit: string | null;
  is_active: boolean;
}

interface HabitCompletion {
  habit_id: string;
  completed: boolean;
}

export function HabitTracker() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [completions, setCompletions] = useState<Map<string, boolean>>(new Map());
  const [streaks, setStreaks] = useState<Map<string, number>>(new Map());
  const [newHabit, setNewHabit] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const today = new Date().toISOString().split("T")[0];

  const fetchData = async () => {
    if (!user) return;

    const { data: habitsData } = await supabase
      .from("habits")
      .select("*")
      .eq("user_id", user.id)
      .eq("is_active", true);

    if (habitsData) {
      setHabits(habitsData);

      const { data: completionsData } = await supabase
        .from("habit_completions")
        .select("habit_id, completed")
        .eq("user_id", user.id)
        .eq("completion_date", today);

      const compMap = new Map<string, boolean>();
      completionsData?.forEach((c) => compMap.set(c.habit_id, c.completed));
      setCompletions(compMap);

      // Calculate streaks
      const streakMap = new Map<string, number>();
      for (const habit of habitsData) {
        const { data: streakData } = await supabase
          .from("habit_completions")
          .select("completion_date, completed")
          .eq("habit_id", habit.id)
          .eq("completed", true)
          .order("completion_date", { ascending: false })
          .limit(30);

        let streak = 0;
        if (streakData) {
          const dates = streakData.map((d) => d.completion_date);
          const checkDate = new Date();
          for (let i = 0; i < 30; i++) {
            const dateStr = checkDate.toISOString().split("T")[0];
            if (dates.includes(dateStr)) {
              streak++;
            } else if (i > 0) break;
            checkDate.setDate(checkDate.getDate() - 1);
          }
        }
        streakMap.set(habit.id, streak);
      }
      setStreaks(streakMap);
    }
  };

  useEffect(() => { fetchData(); }, [user]);

  const toggleHabit = async (habitId: string) => {
    if (!user) return;
    const current = completions.get(habitId) || false;
    const newVal = !current;

    const { error } = await supabase
      .from("habit_completions")
      .upsert({
        habit_id: habitId,
        user_id: user.id,
        completion_date: today,
        completed: newVal,
      }, { onConflict: "habit_id,completion_date" });

    if (!error) {
      setCompletions(new Map(completions.set(habitId, newVal)));
      fetchData();
    }
  };

  const addHabit = async () => {
    if (!user || !newHabit.trim()) return;
    const { error } = await supabase
      .from("habits")
      .insert({ user_id: user.id, name: newHabit.trim() });

    if (!error) {
      setNewHabit("");
      setShowAdd(false);
      fetchData();
      toast({ title: "Habit added!" });
    }
  };

  const completedCount = Array.from(completions.values()).filter(Boolean).length;
  const completionRate = habits.length > 0 ? Math.round((completedCount / habits.length) * 100) : 0;

  return (
    <Card className="glass-card">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-lg font-display flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          Habits
        </CardTitle>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">{completionRate}% done</span>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setShowAdd(!showAdd)}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {showAdd && (
          <div className="flex gap-2">
            <Input
              value={newHabit}
              onChange={(e) => setNewHabit(e.target.value)}
              placeholder="e.g., Drink 3L water"
              className="h-8 text-sm"
              onKeyDown={(e) => e.key === "Enter" && addHabit()}
            />
            <Button size="sm" className="h-8" onClick={addHabit}>Add</Button>
          </div>
        )}

        {habits.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No habits yet. Add one to start tracking!
          </p>
        ) : (
          habits.map((habit) => {
            const completed = completions.get(habit.id) || false;
            const streak = streaks.get(habit.id) || 0;
            return (
              <div
                key={habit.id}
                className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                  completed ? "bg-success/5 border-success/20" : "bg-card border-border"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={completed}
                    onCheckedChange={() => toggleHabit(habit.id)}
                  />
                  <span className={`text-sm ${completed ? "line-through text-muted-foreground" : "text-foreground"}`}>
                    {habit.name}
                  </span>
                </div>
                {streak > 0 && (
                  <div className="flex items-center gap-1 text-xs text-accent">
                    <Flame className="h-3.5 w-3.5" />
                    {streak}d
                  </div>
                )}
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
