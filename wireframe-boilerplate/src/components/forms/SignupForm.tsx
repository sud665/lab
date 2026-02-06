"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button, Input, Card } from "@/components/ui";

export interface SignupFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms?: boolean;
}

export interface SignupFormProps {
  onSubmit?: (data: SignupFormData) => void;
  onLogin?: () => void;
  loading?: boolean;
  error?: string;
  className?: string;
}

export function SignupForm({
  onSubmit,
  onLogin,
  loading = false,
  error,
  className,
}: SignupFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    agreeToTerms?: string;
  }>({});

  const validate = (): boolean => {
    const newErrors: typeof errors = {};

    if (!name) {
      newErrors.name = "Name is required";
    } else if (name.length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Invalid email format";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      newErrors.password =
        "Password must contain uppercase, lowercase, and number";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to the terms";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    onSubmit?.({ name, email, password, confirmPassword, agreeToTerms });
  };

  return (
    <Card className={cn("w-full max-w-md p-8", className)}>
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
          Create account
        </h1>
        <p className="text-[var(--text-secondary)]">Sign up to get started</p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          type="text"
          label="Full Name"
          placeholder="John Doe"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
          disabled={loading}
        />

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
          placeholder="Create a password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          disabled={loading}
        />

        <Input
          type="password"
          label="Confirm Password"
          placeholder="Confirm your password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={errors.confirmPassword}
          disabled={loading}
        />

        <div>
          <label className="flex items-start gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={agreeToTerms}
              onChange={(e) => setAgreeToTerms(e.target.checked)}
              className="mt-1 w-4 h-4 rounded border-[var(--border-default)] bg-[var(--bg-tertiary)] text-white focus:ring-[var(--border-focus)]"
              disabled={loading}
            />
            <span className="text-sm text-[var(--text-secondary)]">
              I agree to the{" "}
              <a
                href="#"
                className="text-[var(--text-primary)] hover:underline"
              >
                Terms of Service
              </a>{" "}
              and{" "}
              <a
                href="#"
                className="text-[var(--text-primary)] hover:underline"
              >
                Privacy Policy
              </a>
            </span>
          </label>
          {errors.agreeToTerms && (
            <p className="mt-1 text-sm text-red-400">{errors.agreeToTerms}</p>
          )}
        </div>

        <Button
          type="submit"
          variant="solid"
          size="lg"
          loading={loading}
          className="w-full"
        >
          Create Account
        </Button>
      </form>

      {onLogin && (
        <p className="mt-8 text-center text-sm text-[var(--text-secondary)]">
          Already have an account?{" "}
          <button
            type="button"
            onClick={onLogin}
            className="text-[var(--text-primary)] hover:underline"
            disabled={loading}
          >
            Sign in
          </button>
        </p>
      )}
    </Card>
  );
}
