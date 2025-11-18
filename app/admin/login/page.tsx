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
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { AlertCircle, Loader2 } from "lucide-react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { login, isAuthenticated } = useAuth();
  const router = useRouter();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/admin");
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const success = await login(email, password);
      if (success) {
        router.push("/admin");
      } else {
        setError("Invalid email or password. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Image/Branding (large screens) */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary to-secondary relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/community-gathering-rwanda-partnership.jpg"
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
                <span className="text-2xl font-bold">23+</span>
              </div>
              <div>
                <p className="font-semibold">Years of Service</p>
                <p className="text-sm opacity-80">
                  Serving communities since 1998
                </p>
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

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <Link href="/" className="flex items-center gap-3 mb-8">
              <Image
                src="/adts-rwanda-ngo-logo-with-globe-and-people.jpg"
                alt="ADTS Rwanda Logo"
                width={48}
                height={48}
                className="object-contain flex-shrink-0"
              />
              <div className="flex flex-col">
                <span className="text-2xl font-bold tracking-tight">ADTS</span>
                <span className="text-sm font-semibold text-primary">
                  RWANDA
                </span>
              </div>
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-600">
              Sign in to access the admin dashboard
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Admin Login</CardTitle>
              <CardDescription>
                Enter your credentials to continue
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@adtsrwanda.org"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link
                      href="#"
                      className="text-sm text-primary hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="remember"
                    className="w-4 h-4 rounded border-gray-300"
                    disabled={isLoading}
                  />
                  <Label
                    htmlFor="remember"
                    className="text-sm font-normal cursor-pointer"
                  >
                    Remember me for 30 days
                  </Label>
                </div>
                <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Signing In...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Need help?{" "}
                  <Link
                    href="/contact"
                    className="text-primary hover:underline"
                  >
                    Contact Support
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
