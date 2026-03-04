import { DailyEntryForm } from "@/components/dashboard/DailyEntryForm";
import { useNavigate } from "react-router-dom";

export default function LogData() {
  const navigate = useNavigate();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">Log Health Data</h1>
        <p className="text-sm text-muted-foreground">Record your daily lifestyle metrics</p>
      </div>
      <DailyEntryForm onSaved={() => navigate("/dashboard")} />
    </div>
  );
}
