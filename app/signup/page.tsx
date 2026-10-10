import type { Metadata } from "next";
import { connection } from "next/server";
import { Suspense } from "react";
import AuthForm from "../components/auth-form";

export const metadata: Metadata = {
  title: "অ্যাকাউন্ট তৈরি — বাজার দর",
};

export default async function SignUpPage() {
  await connection();
  return (
    <Suspense fallback={<div className="flex justify-center p-10">লোড হচ্ছে...</div>}>
      <AuthForm
        githubEnabled={Boolean(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET)}
        googleEnabled={Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET)}
        mode="signup"
      />
    </Suspense>
  );
}
