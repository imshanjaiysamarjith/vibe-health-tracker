import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Activity, LayoutDashboard, PlusCircle, BarChart3,
  Target, FileText, Settings, LogOut, Shield,
} from "lucide-react";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: PlusCircle, label: "Log Data", path: "/dashboard/log" },
  { icon: BarChart3, label: "Analytics", path: "/dashboard/analytics" },
  { icon: Target, label: "Habits", path: "/dashboard/habits" },
  { icon: FileText, label: "Reports", path: "/dashboard/reports" },
  { icon: Settings, label: "Profile", path: "/dashboard/profile" },
];

export function DashboardSidebar() {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-card border-r border-border p-4 flex flex-col z-40 hidden lg:flex">
      <div className="flex items-center gap-2 px-2 mb-8">
        <Activity className="h-7 w-7 text-primary" />
        <span className="text-xl font-display font-bold text-foreground">HealthPulse</span>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map(({ icon: Icon, label, path }) => {
          const active = location.pathname === path;
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                active
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              <Icon className="h-4.5 w-4.5" />
              {label}
            </button>
          );
        })}

        <button
          onClick={() => navigate("/dashboard/admin")}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
            location.pathname === "/dashboard/admin"
              ? "bg-primary/10 text-primary font-medium"
              : "text-muted-foreground hover:bg-secondary hover:text-foreground"
          }`}
        >
          <Shield className="h-4.5 w-4.5" />
          Admin
        </button>
      </nav>

      <Button
        variant="ghost"
        className="justify-start gap-3 text-muted-foreground hover:text-destructive"
        onClick={() => { signOut(); navigate("/"); }}
      >
        <LogOut className="h-4.5 w-4.5" />
        Sign Out
      </Button>
    </aside>
  );
}
