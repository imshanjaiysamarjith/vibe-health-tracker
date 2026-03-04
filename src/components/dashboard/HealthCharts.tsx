import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { format, subDays } from "date-fns";

interface HealthEntry {
  entry_date: string;
  sleep_hours: number | null;
  water_intake_ml: number | null;
  steps: number | null;
  exercise_minutes: number | null;
  health_score: number | null;
}

export function HealthCharts() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<HealthEntry[]>([]);

  useEffect(() => {
    if (!user) return;
    const from = subDays(new Date(), 13).toISOString().split("T")[0];

    supabase
      .from("health_entries")
      .select("entry_date, sleep_hours, water_intake_ml, steps, exercise_minutes, health_score")
      .eq("user_id", user.id)
      .gte("entry_date", from)
      .order("entry_date", { ascending: true })
      .then(({ data }) => {
        if (data) setEntries(data);
      });
  }, [user]);

  const chartData = entries.map((e) => ({
    date: format(new Date(e.entry_date), "MMM d"),
    sleep: e.sleep_hours,
    water: e.water_intake_ml ? e.water_intake_ml / 1000 : null,
    steps: e.steps,
    exercise: e.exercise_minutes,
    score: e.health_score,
  }));

  const charts = [
    {
      title: "Health Score Trend",
      chart: (
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
            <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
            <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
            <Area type="monotone" dataKey="score" stroke="hsl(var(--primary))" fill="url(#scoreGrad)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      ),
    },
    {
      title: "Sleep Trend (hours)",
      chart: (
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
            <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
            <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
            <Line type="monotone" dataKey="sleep" stroke="hsl(var(--chart-4))" strokeWidth={2} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      ),
    },
    {
      title: "Steps",
      chart: (
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
            <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
            <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
            <Bar dataKey="steps" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      ),
    },
    {
      title: "Exercise & Water",
      chart: (
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
            <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
            <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
            <Bar dataKey="exercise" fill="hsl(var(--chart-3))" radius={[4, 4, 0, 0]} name="Exercise (min)" />
            <Bar dataKey="water" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} name="Water (L)" />
          </BarChart>
        </ResponsiveContainer>
      ),
    },
  ];

  if (entries.length === 0) {
    return (
      <Card className="glass-card">
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">Start logging daily data to see your health trends here.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {charts.map(({ title, chart }) => (
        <Card key={title} className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-display">{title}</CardTitle>
          </CardHeader>
          <CardContent className="pb-4">{chart}</CardContent>
        </Card>
      ))}
    </div>
  );
}
