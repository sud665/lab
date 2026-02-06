"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button, Input, Card } from "@/components/ui";

export interface LoginFormData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginFormProps {
  onSubmit?: (data: LoginFormData) => void;
  onForgotPassword?: () => void;
  onSignup?: () => void;
  loading?: boolean;
  error?: string;
  className?: string;
}

export function LoginForm({
  onSubmit,
  onForgotPassword,
  onSignup,
  loading = false,
  error,
  className,
}: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Invalid email format";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    onSubmit?.({ email, password, rememberMe });
  };

  return (
    <Card className={cn("w-full max-w-md p-8", className)}>
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
          Welcome back
        </h1>
        <p className="text-[var(--text-secondary)]">
          Sign in to your account
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          type="email"
          label="Email"
          placeholder="email@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          disabled={loading}
        />

        <Input
          type="password"
          label="Password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          disabled={loading}
        />

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded border-[var(--border-default)] bg-[var(--bg-tertiary)] text-white focus:ring-[var(--border-focus)]"
              disabled={loading}
            />
            <span className="text-sm text-[var(--text-secondary)]">
              Remember me
            </span>
          </label>

          {onForgotPassword && (
            <button
              type="button"
              onClick={onForgotPassword}
              className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              disabled={loading}
            >
              Forgot password?
            </button>
          )}
        </div>

        <Button
          type="submit"
          variant="solid"
          size="lg"
          loading={loading}
          className="w-full"
        >
          Sign In
        </Button>
      </form>

      {onSignup && (
        <p className="mt-8 text-center text-sm text-[var(--text-secondary)]">
          Don&apos;t have an account?{" "}
          <button
            type="button"
            onClick={onSignup}
            className="text-[var(--text-primary)] hover:underline"
            disabled={loading}
          >
            Sign up
          </button>
        </p>
      )}
    </Card>
  );
}
