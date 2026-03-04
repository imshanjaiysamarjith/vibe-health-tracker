import { HealthCharts } from "@/components/dashboard/HealthCharts";

export default function Analytics() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">Health Analytics</h1>
        <p className="text-sm text-muted-foreground">Visual insights from your health data</p>
      </div>
      <HealthCharts />
    </div>
  );
}
