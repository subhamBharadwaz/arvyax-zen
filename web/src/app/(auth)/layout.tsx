import * as React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-wellness-gradient relative overflow-hidden">
      <div className="absolute inset-0 opacity-50">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] via-transparent to-accent/[0.02]" />
      </div>
      <div className="absolute top-20 left-20 w-32 h-32 bg-primary/5 rounded-full blur-3xl animate-zen-fade-in" />
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-accent/5 rounded-full blur-3xl animate-zen-fade-in stagger-1" />
      <div className="absolute top-1/2 left-10 w-24 h-24 bg-secondary/5 rounded-full blur-2xl animate-zen-fade-in stagger-2" />
      <div className="w-full max-w-md relative z-10">
        {/* Auth Card */}
        {children}
        {/* Footer */}
        <div className="text-center mt-6 animate-zen-fade-in stagger-5">
          <p className="text-xs text-muted-foreground">
            By continuing, you agree to our wellness community guidelines
          </p>
        </div>
      </div>
    </div>
  );
}
