import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { calculateHealthScore } from "@/lib/health-score";
import { Moon, Droplets, Footprints, Flame, Dumbbell, Monitor, Brain } from "lucide-react";

interface DailyEntryFormProps {
  onSaved?: () => void;
  date?: string;
}

export function DailyEntryForm({ onSaved, date }: DailyEntryFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [entryDate] = useState(date || new Date().toISOString().split("T")[0]);

  const [sleepHours, setSleepHours] = useState<string>("");
  const [waterIntake, setWaterIntake] = useState<string>("");
  const [steps, setSteps] = useState<string>("");
  const [calories, setCalories] = useState<string>("");
  const [exercise, setExercise] = useState<string>("");
  const [screenTime, setScreenTime] = useState<string>("");
  const [stressLevel, setStressLevel] = useState<number[]>([5]);
  const [mood, setMood] = useState<string>("");

  useEffect(() => {
    if (!user) return;
    supabase
      .from("health_entries")
      .select("*")
      .eq("user_id", user.id)
      .eq("entry_date", entryDate)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setSleepHours(data.sleep_hours?.toString() || "");
          setWaterIntake(data.water_intake_ml?.toString() || "");
          setSteps(data.steps?.toString() || "");
          setCalories(data.calories_consumed?.toString() || "");
          setExercise(data.exercise_minutes?.toString() || "");
          setScreenTime(data.screen_time_minutes?.toString() || "");
          setStressLevel([data.stress_level || 5]);
          setMood(data.mood || "");
        }
      });
  }, [user, entryDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    const entryData = {
      sleep_hours: sleepHours ? parseFloat(sleepHours) : null,
      water_intake_ml: waterIntake ? parseInt(waterIntake) : null,
      steps: steps ? parseInt(steps) : null,
      calories_consumed: calories ? parseInt(calories) : null,
      exercise_minutes: exercise ? parseInt(exercise) : null,
      screen_time_minutes: screenTime ? parseInt(screenTime) : null,
      stress_level: stressLevel[0],
      mood: mood || null,
    };

    const healthScore = calculateHealthScore(entryData);

    const { error } = await supabase
      .from("health_entries")
      .upsert({
        user_id: user.id,
        entry_date: entryDate,
        ...entryData,
        health_score: healthScore,
      }, { onConflict: "user_id,entry_date" });

    if (error) {
      toast({ title: "Error saving entry", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Entry saved!", description: `Health score: ${healthScore}/100` });
      onSaved?.();
    }
    setLoading(false);
  };

  const fields = [
    { icon: Moon, label: "Sleep Hours", value: sleepHours, setter: setSleepHours, placeholder: "7.5", type: "number", step: "0.5" },
    { icon: Droplets, label: "Water Intake (ml)", value: waterIntake, setter: setWaterIntake, placeholder: "2500", type: "number" },
    { icon: Footprints, label: "Steps", value: steps, setter: setSteps, placeholder: "8000", type: "number" },
    { icon: Flame, label: "Calories", value: calories, setter: setCalories, placeholder: "2000", type: "number" },
    { icon: Dumbbell, label: "Exercise (min)", value: exercise, setter: setExercise, placeholder: "30", type: "number" },
    { icon: Monitor, label: "Screen Time (min)", value: screenTime, setter: setScreenTime, placeholder: "120", type: "number" },
  ];

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="text-lg font-display">Log Today's Health Data</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {fields.map(({ icon: Icon, label, value, setter, placeholder, type, step }) => (
              <div key={label} className="space-y-1.5">
                <Label className="text-xs flex items-center gap-1.5">
                  <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                  {label}
                </Label>
                <Input
                  type={type}
                  step={step}
                  value={value}
                  onChange={(e) => setter(e.target.value)}
                  placeholder={placeholder}
                  className="h-9"
                />
              </div>
            ))}
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs flex items-center gap-1.5">
              <Brain className="h-3.5 w-3.5 text-muted-foreground" />
              Stress Level: {stressLevel[0]}/10
            </Label>
            <Slider
              value={stressLevel}
              onValueChange={setStressLevel}
              min={1}
              max={10}
              step={1}
              className="py-2"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Mood</Label>
            <Select value={mood} onValueChange={setMood}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="How are you feeling?" />
              </SelectTrigger>
              <SelectContent>
                {["great", "good", "okay", "bad", "terrible"].map((m) => (
                  <SelectItem key={m} value={m}>
                    {m === "great" ? "😄 Great" : m === "good" ? "🙂 Good" : m === "okay" ? "😐 Okay" : m === "bad" ? "😟 Bad" : "😫 Terrible"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Saving..." : "Save Entry"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
