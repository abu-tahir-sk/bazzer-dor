"use client";

import { useRef, useState, useEffect, type FormEvent } from "react";
import Link from "next/link";
import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "../lib/auth-client";
import { AUTH_TOAST_STORAGE_KEY } from "../lib/auth-toast";
import { useToast } from "./toast-provider";

type AuthFormProps = {
  mode: "signin" | "signup";
  googleEnabled: boolean;
  githubEnabled: boolean;
};

function getErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) return error.message;
  return "অনুরোধটি সম্পন্ন করা যায়নি। আবার চেষ্টা করুন।";
}

export default function AuthForm({
  mode,
  googleEnabled,
  githubEnabled,
}: AuthFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  // Check for redirect errors
  useEffect(() => {
    const error = searchParams.get("error");
    if (error === "protected") {
      showToast("এই পেজটি দেখতে লগইন করুন।", "error");
      // Remove param from url silently
      router.replace("/signin");
    }
  }, [searchParams, router, showToast]);
  const lastValidationToast = useRef(0);
  const isSignup = mode === "signup";
  const emailInputId = isSignup ? "signup-email" : "signin-email";
  const passwordInputId = isSignup ? "signup-password" : "signin-password";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    try {
      if (isSignup) {
        const name = String(formData.get("name") ?? "").trim();
        const result = await authClient.signUp.email({ name, email, password });
        if (result.error) throw new Error(result.error.message);

        showToast("অ্যাকাউন্ট তৈরি হয়েছে। এখন সাইন ইন করুন।");
        router.push("/signin");
      } else {
        const result = await authClient.signIn.email({ email, password });
        if (result.error) throw new Error(result.error.message);

        showToast("সফলভাবে সাইন ইন হয়েছে।");
        router.replace("/");
        router.refresh();
      }
    } catch (error) {
      const message = getErrorMessage(error);
      setFormError(message);
      showToast(message, "error");
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleInvalid() {
    const now = Date.now();
    if (now - lastValidationToast.current < 1000) return;
    lastValidationToast.current = now;
    const message = "সব তথ্য সঠিকভাবে পূরণ করুন।";
    setFormError(message);
    showToast(message, "error");
  }

  async function handleSocialSignIn(provider: "google" | "github", enabled: boolean) {
    if (!enabled) {
      showToast(
        `${provider === "google" ? "Google" : "GitHub"} লগইন চালু করতে .env.local ফাইলে OAuth client ID ও secret যোগ করুন।`,
        "error",
      );
      return;
    }

    setIsSubmitting(true);
    setFormError("");
    window.sessionStorage.setItem(
      AUTH_TOAST_STORAGE_KEY,
      JSON.stringify({ message: "সামাজিক অ্যাকাউন্ট দিয়ে সফলভাবে সাইন ইন হয়েছে।", type: "success" }),
    );

    try {
      const result = await authClient.signIn.social({
        provider,
        callbackURL: "/",
      });
      if (result.error) throw new Error(result.error.message);
    } catch (error) {
      window.sessionStorage.removeItem(AUTH_TOAST_STORAGE_KEY);
      const message = getErrorMessage(error);
      setFormError(message);
      showToast(message, "error");
      setIsSubmitting(false);
    }
  }

  const inputClassName =
    "mt-1 block w-full rounded-md border border-bazaar-border bg-white px-3 py-2.5 text-sm text-bazaar-ink outline-none transition placeholder:text-[#929c95] focus:border-bazaar-green focus:ring-2 focus:ring-bazaar-green/15 disabled:bg-[#f7faf7]";

  return (
    <main className="mx-auto flex min-h-[calc(100vh-180px)] w-full max-w-5xl flex-col items-center px-4 py-10 sm:py-14">
      <div className="mb-5 text-center">
        <h1 className="m-0 text-2xl font-extrabold text-[#25372c]">
          {isSignup ? "অ্যাকাউন্ট তৈরি করুন" : "সাইন ইন"}
        </h1>
        <p className="mt-2 mb-0 text-sm text-bazaar-muted">
          {isSignup
            ? "বিনা ঝামেলায় বাজার দেখুন আর পছন্দের দামের আপডেট থাকুন।"
            : "বিস্তারিত দাম, বাজার তুলনা ও প্রাইস ট্র্যাকিং দেখতে অ্যাকাউন্টে ঢুকুন।"}
        </p>
      </div>

      <section className="w-full max-w-md rounded-xl border border-bazaar-border bg-white p-5 shadow-[0_3px_14px_rgba(31,72,44,0.04)] sm:p-6">
        <form className="space-y-4" onInvalidCapture={handleInvalid} onSubmit={handleSubmit}>
          {isSignup && (
            <div>
              <label className="text-xs font-semibold text-[#34443a]" htmlFor="name">নাম</label>
              <input
                autoComplete="name"
                className={inputClassName}
                id="name"
                maxLength={80}
                minLength={2}
                name="name"
                placeholder="যেমন: রহিম উদ্দিন"
                required
                type="text"
              />
            </div>
          )}
          <div>
            <label className="text-xs font-semibold text-[#34443a]" htmlFor={emailInputId}>ইমেইল</label>
            <input
              autoComplete="email"
              className={inputClassName}
              id={emailInputId}
              maxLength={254}
              name="email"
              placeholder="you@example.com"
              required
              type="email"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-[#34443a]" htmlFor={passwordInputId}>পাসওয়ার্ড</label>
            <input
              autoComplete={isSignup ? "new-password" : "current-password"}
              className={inputClassName}
              id={passwordInputId}
              minLength={8}
              name="password"
              placeholder={isSignup ? "কমপক্ষে ৮ অক্ষর" : "আপনার পাসওয়ার্ড"}
              required
              type="password"
            />
          </div>

          {formError && (
            <p className="m-0 rounded-md border border-[#f3cecc] bg-[#fff6f5] px-3 py-2 text-xs text-[#a8322e]" role="alert">
              {formError}
            </p>
          )}

          <button
            className="flex min-h-11 w-full items-center justify-center rounded-md bg-[#168b49] px-4 py-2.5 text-sm font-bold text-white shadow-[0_3px_0_#d4e8da] transition hover:bg-[#117c40] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bazaar-green disabled:cursor-wait disabled:opacity-65"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting
              ? "অপেক্ষা করুন…"
              : isSignup
                ? "অ্যাকাউন্ট তৈরি করুন"
                : "সাইন ইন"}
          </button>
        </form>

        <div className="my-4 flex items-center gap-3 text-xs text-bazaar-muted">
          <span className="h-px flex-1 bg-[#e2e9e3]" />
          অথবা
          <span className="h-px flex-1 bg-[#e2e9e3]" />
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <button
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-bazaar-border bg-white px-2 text-xs font-semibold text-[#34443a] transition hover:bg-[#f7faf7] disabled:cursor-wait disabled:opacity-60"
            disabled={isSubmitting}
            onClick={() => void handleSocialSignIn("google", googleEnabled)}
            type="button"
          >
            <span aria-hidden="true" className="font-extrabold text-[#4285f4]">G</span>
            Google দিয়ে {isSignup ? "অ্যাকাউন্ট খুলুন" : "চালিয়ে যান"}
          </button>
          <button
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-bazaar-border bg-white px-2 text-xs font-semibold text-[#34443a] transition hover:bg-[#f7faf7] disabled:cursor-wait disabled:opacity-60"
            disabled={isSubmitting}
            onClick={() => void handleSocialSignIn("github", githubEnabled)}
            type="button"
          >
            <span aria-hidden="true" className="grid size-4 place-items-center rounded-full bg-[#24292f] text-[9px] font-bold text-white">GH</span>
            GitHub দিয়ে {isSignup ? "অ্যাকাউন্ট খুলুন" : "চালিয়ে যান"}
          </button>
        </div>

        <p className="mt-4 mb-0 text-center text-xs text-bazaar-muted">
          {isSignup ? "অ্যাকাউন্ট আছে?" : "অ্যাকাউন্ট নেই?"}{" "}
          <Link
            className="font-bold text-bazaar-green no-underline hover:underline"
            href={isSignup ? "/signin" : "/signup"}
          >
            {isSignup ? "সাইন ইন করুন" : "নতুন অ্যাকাউন্ট খুলুন"}
          </Link>
        </p>
      </section>

      <Link className="mt-5 text-xs text-[#87928a] no-underline hover:text-bazaar-green" href="/">
        ← হোম পেজে ফিরে যান
      </Link>
    </main>
  );
}
