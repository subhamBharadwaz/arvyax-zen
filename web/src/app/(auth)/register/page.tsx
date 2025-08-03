import { RegisterForm } from "@/features/auth/components/register-form";
import Link from "next/link";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function RegisterPage() {
  const cookieStore = cookies();
  const token = (await cookieStore).get("token");

  if (token) {
    redirect("/dashboard");
  }

  return (
    <div className="zen-card p-8 animate-zen-scale-in stagger-1">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold text-foreground mb-2 animate-zen-fade-in stagger-2">
          Join Arvyax Zen
        </h2>
        <p className="text-muted-foreground animate-zen-fade-in stagger-3">
          Create your account and start your wellness journey
        </p>
      </div>

      <div className="animate-zen-fade-in stagger-4">
        <RegisterForm />
        <div className="text-center pt-4 border-t border-border/50">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-primary hover:text-primary/80 font-medium transition-colors"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
