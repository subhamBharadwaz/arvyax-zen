import { LoginForm } from "@/features/auth/components/login-form";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const cookieStore = cookies();
  const token = (await cookieStore).get("token");

  if (token) {
    redirect("/dashboard");
  }

  return (
    <div className="zen-card p-8 animate-zen-scale-in stagger-1">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold text-foreground mb-2 animate-zen-fade-in stagger-2">
          Welcome Back
        </h2>
        <p className="text-muted-foreground animate-zen-fade-in stagger-3">
          Sign in to continue your wellness journey
        </p>
      </div>

      <div className="animate-zen-fade-in stagger-4">
        <LoginForm />
        <div className="text-center pt-4 border-t border-border/50">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="text-primary hover:text-primary/80 font-medium transition-colors"
            >
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
