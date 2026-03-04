import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: LucideIcon;
  trend?: string;
  color?: string;
}

export function StatCard({ title, value, unit, icon: Icon, trend, color }: StatCardProps) {
  return (
    <Card className="glass-card hover:shadow-[var(--shadow-elevated)] transition-all duration-300">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{title}</p>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-display font-bold text-foreground">{value}</span>
              {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
            </div>
            {trend && (
              <p className="text-xs text-success font-medium">{trend}</p>
            )}
          </div>
          <div className="p-2.5 rounded-xl bg-primary/10" style={color ? { backgroundColor: `${color}15` } : {}}>
            <Icon className="h-5 w-5 text-primary" style={color ? { color } : {}} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
