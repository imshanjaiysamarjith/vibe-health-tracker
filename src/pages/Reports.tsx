import { WeeklyReport } from "@/components/dashboard/WeeklyReport";
import { HealthCharts } from "@/components/dashboard/HealthCharts";

export default function Reports() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">Weekly Reports</h1>
        <p className="text-sm text-muted-foreground">Summary of your health journey</p>
      </div>
      <WeeklyReport />
      <HealthCharts />
    </div>
  );
}
