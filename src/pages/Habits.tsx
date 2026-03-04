import { HabitTracker } from "@/components/dashboard/HabitTracker";

export default function Habits() {
  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">Habit Tracker</h1>
        <p className="text-sm text-muted-foreground">Build and maintain healthy daily habits</p>
      </div>
      <HabitTracker />
    </div>
  );
}
