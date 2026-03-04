import { useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, PlusCircle, BarChart3, Target, User } from "lucide-react";

const items = [
  { icon: LayoutDashboard, label: "Home", path: "/dashboard" },
  { icon: PlusCircle, label: "Log", path: "/dashboard/log" },
  { icon: BarChart3, label: "Charts", path: "/dashboard/analytics" },
  { icon: Target, label: "Habits", path: "/dashboard/habits" },
  { icon: User, label: "Profile", path: "/dashboard/profile" },
];

export function MobileNav() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-40 lg:hidden">
      <div className="flex items-center justify-around py-2">
        {items.map(({ icon: Icon, label, path }) => {
          const active = location.pathname === path;
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-colors ${
                active ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[10px] font-medium">{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
