"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  XCircle,
} from "lucide-react";

function SetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") ?? "";

  const [status, setStatus] = useState<"loading" | "valid" | "invalid">("loading");
  const [tokenError, setTokenError] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      setStatus("invalid");
      setTokenError("No invitation token found. Please use the link from your email.");
      return;
    }

    fetch(`/api/admin/set-password?token=${encodeURIComponent(token)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.valid) {
          setStatus("valid");
          setRecipientName(data.fullName || "");
          setRecipientEmail(data.email || "");
        } else {
          setStatus("invalid");
          setTokenError(data.error || "Invalid invitation link.");
        }
      })
      .catch(() => {
        setStatus("invalid");
        setTokenError("Failed to verify invitation. Please try again.");
      });
  }, [token]);

  const passwordStrength = (() => {
    let s = 0;
    if (password.length >= 8) s++;
    if (/[A-Z]/.test(password)) s++;
    if (/[0-9]/.test(password)) s++;
    if (/[^A-Za-z0-9]/.test(password)) s++;
    return s;
  })();

  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][passwordStrength];
  const strengthColor = ["", "bg-red-400", "bg-orange-400", "bg-yellow-400", "bg-green-500"][passwordStrength];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/admin/set-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to set password. Please try again.");
        return;
      }

      setSuccess(true);
      setTimeout(() => router.push("/admin/login"), 3000);
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const leftSide = (
    <div className="hidden lg:flex flex-1 bg-gradient-to-br from-black to-black relative overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/images/image_8.jpeg"
          alt="ADTS Rwanda Community"
          fill
          className="object-cover opacity-20"
        />
      </div>
      <div className="relative z-10 flex flex-col justify-center p-12 text-white">
        <h2 className="text-4xl font-bold mb-4 text-balance">
          Welcome to ADTS Rwanda
        </h2>
        <p className="text-xl mb-8 text-pretty opacity-90">
          You have been invited to join the ADTS Rwanda admin team. Set your
          password to activate your account and get started.
        </p>
        <div className="space-y-4">
          {[
            { stat: "27+", label: "Years of Service", sub: "Serving communities since 1998" },
            { stat: "140k+", label: "People Reached", sub: "Across Rwanda and the Great Lakes region" },
            { stat: "86k+", label: "Women Empowered", sub: "Through our programs and initiatives" },
          ].map(({ stat, label, sub }) => (
            <div key={stat} className="flex items-center gap-3">
              <div className="w-18 h-18 rounded-full bg-white/20 flex items-center justify-center">
                <span className="text-2xl font-bold">{stat}</span>
              </div>
              <div>
                <p className="font-semibold">{label}</p>
                <p className="text-sm opacity-80">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex">
      {leftSide}

      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 mb-8">
            <Image
              src="/images/ADTS LOGO.jpg"
              alt="ADTS Rwanda Logo"
              width={48}
              height={48}
              className="object-contain flex-shrink-0 rounded-lg"
            />
            <div className="flex flex-col">
              <span className="text-2xl font-bold tracking-tight">ADTS</span>
              <span className="text-sm font-semibold text-primary">RWANDA</span>
            </div>
          </Link>

          {/* Loading */}
          {status === "loading" && (
            <div className="text-center py-16">
              <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto mb-4" />
              <p className="text-gray-500">Verifying your invitation link...</p>
            </div>
          )}

          {/* Invalid token */}
          {status === "invalid" && (
            <Card>
              <CardContent className="px-6 py-8 text-center">
                <XCircle className="w-14 h-14 text-red-400 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-gray-900 mb-2">Link Invalid or Expired</h2>
                <p className="text-sm text-gray-500 mb-6">{tokenError}</p>
                <Link href="/admin/login">
                  <Button variant="outline" className="w-full">Back to Login</Button>
                </Link>
              </CardContent>
            </Card>
          )}

          {/* Success */}
          {status === "valid" && success && (
            <Card>
              <CardContent className="px-6 py-8 text-center">
                <CheckCircle2 className="w-14 h-14 text-green-500 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-gray-900 mb-2">Password Set!</h2>
                <p className="text-sm text-gray-500 mb-1">
                  Your account is now active. Redirecting you to login...
                </p>
                <div className="flex justify-center mt-4">
                  <Loader2 className="w-5 h-5 animate-spin text-primary" />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Form */}
          {status === "valid" && !success && (
            <>
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-1">Set Your Password</h1>
                {recipientName && (
                  <p className="text-gray-600">
                    Welcome, <span className="font-medium text-gray-900">{recipientName}</span>!
                    Choose a strong password for <span className="text-primary">{recipientEmail}</span>.
                  </p>
                )}
              </div>

              <Card>
                <CardHeader className="px-6 pt-6 pb-2">
                  <CardTitle className="text-base">Create your password</CardTitle>
                  <CardDescription>You&apos;ll use this to sign in to the admin portal</CardDescription>
                </CardHeader>
                <CardContent className="px-6 pt-4 pb-6">
                  {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span className="text-sm">{error}</span>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* New password */}
                    <div className="space-y-1.5">
                      <Label htmlFor="password">New Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="At least 8 characters"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-10 pr-10"
                          required
                          disabled={isSubmitting}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((p) => !p)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          tabIndex={-1}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {/* Strength bar */}
                      {password.length > 0 && (
                        <div className="space-y-1">
                          <div className="flex gap-1">
                            {[1, 2, 3, 4].map((level) => (
                              <div
                                key={level}
                                className={`h-1 flex-1 rounded-full transition-colors ${
                                  level <= passwordStrength ? strengthColor : "bg-gray-200"
                                }`}
                              />
                            ))}
                          </div>
                          {strengthLabel && (
                            <p className="text-xs text-gray-500">
                              Strength: <span className="font-medium">{strengthLabel}</span>
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Confirm password */}
                    <div className="space-y-1.5">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          id="confirmPassword"
                          type={showConfirm ? "text" : "password"}
                          placeholder="Repeat your password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className={`pl-10 pr-10 ${
                            confirmPassword && confirmPassword !== password
                              ? "border-red-400"
                              : ""
                          }`}
                          required
                          disabled={isSubmitting}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirm((p) => !p)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          tabIndex={-1}
                        >
                          {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {confirmPassword && confirmPassword !== password && (
                        <p className="text-xs text-red-500">Passwords do not match</p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      className="w-full"
                      size="lg"
                      disabled={isSubmitting || (!!confirmPassword && confirmPassword !== password)}
                    >
                      {isSubmitting ? (
                        <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Activating account...</>
                      ) : (
                        "Activate My Account"
                      )}
                    </Button>
                  </form>

                  <div className="mt-6 pt-4 border-t text-center">
                    <p className="text-sm text-gray-500">
                      Already have an account?{" "}
                      <Link href="/admin/login" className="text-primary hover:underline font-medium">
                        Sign in
                      </Link>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          <div className="mt-8 text-center text-sm text-gray-400">
            <Link href="/" className="hover:text-primary transition-colors">
              Back to ADTS Rwanda website
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    }>
      <SetPasswordForm />
    </Suspense>
  );
}
