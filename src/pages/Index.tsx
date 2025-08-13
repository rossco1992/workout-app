import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import WorkoutDashboard from "@/components/WorkoutDashboard";

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Temporarily skip auth for testing
  // if (!user) {
  //   return (
  //     <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
  //       <div className="text-center space-y-6">
  //         <h1 className="text-4xl font-bold text-foreground">Welcome to FitTracker Pro</h1>
  //         <p className="text-xl text-muted-foreground">Track your workouts and achieve your fitness goals</p>
  //         <Button onClick={() => navigate("/auth")} size="lg">
  //           Get Started
  //         </Button>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="absolute top-4 right-4 z-10">
        <Button variant="outline" onClick={handleSignOut} className="gap-2">
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
      <WorkoutDashboard />
    </div>
  );
};

export default Index;
