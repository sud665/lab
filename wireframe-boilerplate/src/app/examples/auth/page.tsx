"use client";

import { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/layout";
import { Container } from "@/components/layout/Container";
import { ThemeToggle } from "@/components/providers";
import { LoginForm, SignupForm } from "@/components/forms";
import { Button } from "@/components/ui";

type AuthView = "login" | "signup";

export default function AuthExamplePage() {
  const [view, setView] = useState<AuthView>("login");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (data: { email: string; password: string }) => {
    setLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log("Login data:", data);
    setLoading(false);
    alert("Login successful! (Demo)");
  };

  const handleSignup = async (data: {
    name: string;
    email: string;
    password: string;
  }) => {
    setLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log("Signup data:", data);
    setLoading(false);
    alert("Signup successful! (Demo)");
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <Header
        logo={
          <Link href="/" className="font-semibold text-[var(--text-primary)]">
            Wireframe
          </Link>
        }
        actions={
          <div className="flex items-center gap-4">
            <ThemeToggle size="sm" />
            <Link href="/">
              <Button variant="ghost" size="sm">
                Home
              </Button>
            </Link>
          </div>
        }
        sticky
      />

      <Container size="sm" className="py-16">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-4">
            Authentication Forms
          </h1>
          <p className="text-[var(--text-secondary)]">
            Login and Signup form examples with validation
          </p>
        </div>

        {/* Toggle buttons */}
        <div className="flex justify-center gap-2 mb-8">
          <Button
            variant={view === "login" ? "solid" : "ghost"}
            onClick={() => setView("login")}
          >
            Login
          </Button>
          <Button
            variant={view === "signup" ? "solid" : "ghost"}
            onClick={() => setView("signup")}
          >
            Signup
          </Button>
        </div>

        {/* Forms */}
        <div className="flex justify-center">
          {view === "login" ? (
            <LoginForm
              onSubmit={handleLogin}
              onSignup={() => setView("signup")}
              onForgotPassword={() => alert("Forgot password clicked (Demo)")}
              loading={loading}
            />
          ) : (
            <SignupForm
              onSubmit={handleSignup}
              onLogin={() => setView("login")}
              loading={loading}
            />
          )}
        </div>
      </Container>
    </div>
  );
}
