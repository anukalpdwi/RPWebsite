import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, LogIn, ShieldCheck } from "lucide-react";
import { schoolInfo } from "@/lib/utils";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      setLocation("/admin/dashboard");
    }
  }, [user, setLocation]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast({
        title: "Login Successful",
        description: "Welcome back to the Admin Panel.",
      });
      setLocation("/admin/dashboard");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: error.message || "Invalid email or password.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-accent/5 blur-[120px] pointer-events-none" />

      <Card className="w-full max-w-md shadow-2xl border-t-4 border-t-primary animate-in fade-in zoom-in duration-500 relative z-10">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-2 overflow-hidden border-2 border-primary/20">
             <img src="/Images/logo/favicon.jpg" alt="Logo" className="w-full h-full object-contain" />
          </div>
          <div className="space-y-1">
            <CardTitle className="text-2xl font-bold font-heading">{schoolInfo.name}</CardTitle>
            <CardDescription className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Admin Portal Login
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Work Email</Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@rppublicschool.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-3 focus-visible:ring-primary"
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-3 focus-visible:ring-primary"
                />
              </div>
            </div>
            <Button
              type="submit"
              className="w-full h-11 bg-primary hover:bg-primary-dark transition-all duration-300 font-semibold"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
              ) : (
                <LogIn className="w-5 h-5 mr-2" />
              )}
              Sign In to Dashboard
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-4 pt-2 pb-6 border-t bg-muted/30 rounded-b-lg">
          <div className="flex items-center text-xs text-muted-foreground">
            <ShieldCheck className="w-3.5 h-3.5 mr-1 text-green-600" />
            Secure End-to-End Encryption
          </div>
        </CardFooter>
      </Card>

      {/* Footer Branding */}
      <div className="absolute bottom-6 left-0 right-0 text-center animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} {schoolInfo.name}. Internal Use Only.
        </p>
      </div>
    </div>
  );
}
