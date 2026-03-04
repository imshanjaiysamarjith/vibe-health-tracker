import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Activity, ArrowRight, BarChart3, Heart, Sparkles, Target, Shield } from "lucide-react";
import { useEffect } from "react";

export default function Index() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate("/dashboard");
  }, [user, navigate]);

  const features = [
    { icon: Heart, title: "Health Score", description: "AI-calculated daily health score from 0–100 based on your lifestyle data" },
    { icon: BarChart3, title: "Visual Analytics", description: "Beautiful charts tracking sleep, steps, hydration, and exercise trends" },
    { icon: Target, title: "Habit Tracking", description: "Create and maintain daily health habits with streak statistics" },
    { icon: Sparkles, title: "AI Recommendations", description: "Personalized suggestions to improve your health based on data trends" },
    { icon: Activity, title: "Weekly Reports", description: "Automated summaries of your health progress and improvement areas" },
    { icon: Shield, title: "Secure & Private", description: "Your health data is encrypted and only accessible by you" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header className="fixed top-0 w-full bg-background/80 backdrop-blur-xl border-b border-border/50 z-50">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <Activity className="h-6 w-6 text-primary" />
            <span className="text-lg font-display font-bold text-foreground">HealthPulse</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => navigate("/auth")}>Sign In</Button>
            <Button onClick={() => navigate("/auth")}>
              Get Started <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4">
        <div className="container max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 animate-fade-up">
            <Sparkles className="h-4 w-4" />
            AI-Powered Health Insights
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-foreground leading-tight mb-6 animate-fade-up-delay-1">
            Your Personal Health
            <br />
            <span className="gradient-hero bg-clip-text text-transparent">Monitoring Dashboard</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-up-delay-2">
            Track sleep, hydration, exercise, and more. Get AI-powered recommendations
            and visualize your health journey with beautiful analytics.
          </p>
          <div className="flex items-center justify-center gap-4 animate-fade-up-delay-3">
            <Button size="lg" onClick={() => navigate("/auth")} className="text-base px-8">
              Start Tracking <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-secondary/30">
        <div className="container max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold text-foreground mb-3">
              Everything You Need
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Comprehensive health monitoring tools designed to help you build lasting healthy habits.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, description }, i) => (
              <div
                key={title}
                className="glass-card rounded-2xl p-6 hover:shadow-[var(--shadow-elevated)] transition-all duration-300 group"
              >
                <div className="p-3 rounded-xl bg-primary/10 w-fit mb-4 group-hover:bg-primary/20 transition-colors">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-display font-semibold text-foreground mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Activity className="h-5 w-5 text-primary" />
            <span className="font-display font-semibold text-foreground">HealthPulse</span>
          </div>
          <p className="text-xs text-muted-foreground">
            AI-powered personal health monitoring. Track, analyze, improve.
          </p>
        </div>
      </footer>
    </div>
  );
}
