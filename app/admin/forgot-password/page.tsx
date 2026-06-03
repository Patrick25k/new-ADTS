"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, CheckCircle2, Loader2, Mail } from "lucide-react";

type Step = 1 | 2 | 3;

const STEP_LABELS = ["Email", "Verify", "Password"];

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<Step>(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to send OTP. Please try again.");
        return;
      }

      setStep(2);
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 6) {
      setError("Please enter the complete 6-digit OTP.");
      return;
    }
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Invalid OTP. Please try again.");
        return;
      }

      setStep(3);
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to reset password. Please try again.");
        return;
      }

      setSuccess("Password reset successfully! Redirecting to login...");
      setTimeout(() => router.push("/admin/login"), 2000);
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const stepIndicator = (
    <div className="flex items-center justify-center mb-6">
      {([1, 2, 3] as Step[]).map((s, i) => (
        <div key={s} className="flex items-center">
          <div className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                step >= s
                  ? "bg-gray-800 text-white"
                  : "bg-gray-100 text-gray-500 border border-gray-300"
              }`}
            >
              {s}
            </div>
            <span
              className={`text-sm transition-colors ${
                step >= s ? "text-gray-800 font-medium" : "text-gray-400"
              }`}
            >
              {STEP_LABELS[i]}
            </span>
          </div>
          {i < 2 && (
            <div
              className={`w-10 h-px mx-2 transition-colors ${
                step > s ? "bg-gray-800" : "bg-gray-300"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen flex">
      {/* Left Side – Branding (large screens only) */}
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
            Transforming Lives, Empowering Communities
          </h2>
          <p className="text-xl mb-8 text-pretty opacity-90">
            Manage and oversee ADTS Rwanda's programs, content, and community
            impact through our comprehensive admin dashboard.
          </p>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-18 h-18 rounded-full bg-white/20 flex items-center justify-center">
                <span className="text-2xl font-bold">27+</span>
              </div>
              <div>
                <p className="font-semibold">Years of Service</p>
                <p className="text-sm opacity-80">Serving communities since 1998</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-18 h-18 rounded-full bg-white/20 flex items-center justify-center">
                <span className="text-2xl font-bold">140k+</span>
              </div>
              <div>
                <p className="font-semibold">People Reached</p>
                <p className="text-sm opacity-80">
                  Across Rwanda and the Great Lakes region
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-18 h-18 rounded-full bg-white/20 flex items-center justify-center">
                <span className="text-2xl font-bold">86k+</span>
              </div>
              <div>
                <p className="font-semibold">Women Empowered</p>
                <p className="text-sm opacity-80">
                  Through our programs and initiatives
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side – Multi-step form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="mb-8">
            <Link href="/" className="flex items-center gap-3 mb-8">
              <Image
                src="/images/ADTS LOGO.jpg"
                alt="ADTS Rwanda Logo"
                width={48}
                height={48}
                className="object-contain flex-shrink-0"
              />
              <div className="flex flex-col">
                <span className="text-2xl font-bold tracking-tight">ADTS</span>
                <span className="text-sm font-semibold text-primary">RWANDA</span>
              </div>
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Forgot Password?
            </h1>
            <p className="text-gray-600 mb-6">
              We&apos;ll send a reset code to your email.
            </p>
            {stepIndicator}
          </div>

          <Card>
            <CardHeader className="px-6 pt-6 pb-2">
              <CardTitle>
                {step === 1 && "Enter your email"}
                {step === 2 && "Verify OTP"}
                {step === 3 && "Set new password"}
              </CardTitle>
              <CardDescription>
                {step === 1 && "We'll send a 6-digit code to your email address"}
                {step === 2 && (
                  <>
                    Enter the code sent to{" "}
                    <span className="font-medium text-gray-700">{email}</span>
                  </>
                )}
                {step === 3 && "Choose a strong new password for your account"}
              </CardDescription>
            </CardHeader>

            <CardContent className="px-6 pt-4 pb-6">
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              {success && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-700">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm">{success}</span>
                </div>
              )}

              {/* Step 1 – Email */}
              {step === 1 && (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email or Username</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Mail className="w-4 h-4 mr-2" />
                        Send OTP
                      </>
                    )}
                  </Button>
                </form>
              )}

              {/* Step 2 – OTP Verification */}
              {step === 2 && (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div className="space-y-3">
                    <Label>Verification Code</Label>
                    <div className="flex justify-center">
                      <InputOTP
                        maxLength={6}
                        value={otp}
                        onChange={(val) => {
                          setOtp(val);
                          setError("");
                        }}
                        disabled={isLoading}
                      >
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </div>
                    <p className="text-xs text-gray-500 text-center">
                      Didn&apos;t receive the code?{" "}
                      <button
                        type="button"
                        className="text-primary hover:underline font-medium"
                        onClick={() => {
                          setOtp("");
                          setError("");
                          setStep(1);
                        }}
                      >
                        Resend
                      </button>
                    </p>
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={isLoading || otp.length < 6}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      "Verify OTP"
                    )}
                  </Button>
                </form>
              )}

              {/* Step 3 – New Password */}
              {step === 3 && (
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      placeholder="At least 8 characters"
                      value={newPassword}
                      onChange={(e) => {
                        setNewPassword(e.target.value);
                        setError("");
                      }}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Repeat your new password"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        setError("");
                      }}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Resetting...
                      </>
                    ) : (
                      "Reset Password"
                    )}
                  </Button>
                </form>
              )}

              <div className="mt-6 pt-4 border-t text-center">
                <p className="text-sm text-gray-600">
                  Remember your password?{" "}
                  <Link href="/admin/login" className="text-primary hover:underline">
                    Login
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="mt-8 text-center text-sm text-gray-500">
            <p>
              Protected by security measures.{" "}
              <Link href="/" className="text-primary hover:underline">
                Back to website
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
