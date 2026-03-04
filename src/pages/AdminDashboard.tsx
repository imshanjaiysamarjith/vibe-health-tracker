import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/dashboard/StatCard";
import { Users, Activity, TrendingUp, Calendar } from "lucide-react";

export default function AdminDashboard() {
  const [totalUsers, setTotalUsers] = useState(0);
  const [todayEntries, setTodayEntries] = useState(0);
  const [weekEntries, setWeekEntries] = useState(0);
  const [avgScore, setAvgScore] = useState(0);

  useEffect(() => {
    // Get total profiles count
    supabase.from("profiles").select("id", { count: "exact", head: true }).then(({ count }) => {
      setTotalUsers(count || 0);
    });

    const today = new Date().toISOString().split("T")[0];
    supabase.from("health_entries").select("id", { count: "exact", head: true }).eq("entry_date", today).then(({ count }) => {
      setTodayEntries(count || 0);
    });

    const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString().split("T")[0];
    supabase.from("health_entries").select("health_score").gte("entry_date", weekAgo).then(({ data }) => {
      if (data && data.length > 0) {
        setWeekEntries(data.length);
        const avg = data.reduce((a, e) => a + (e.health_score || 0), 0) / data.length;
        setAvgScore(Math.round(avg));
      }
    });
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-sm text-muted-foreground">Platform overview and statistics</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Users" value={totalUsers} icon={Users} />
        <StatCard title="Today's Entries" value={todayEntries} icon={Calendar} />
        <StatCard title="Week Entries" value={weekEntries} icon={Activity} />
        <StatCard title="Avg Health Score" value={avgScore} unit="/100" icon={TrendingUp} />
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-lg font-display">Platform Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            User engagement and platform health metrics are displayed above.
            As more users join and log data, detailed analytics will populate here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
