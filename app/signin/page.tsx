import type { Metadata } from "next";
import { connection } from "next/server";
import AuthForm from "../components/auth-form";

export const metadata: Metadata = {
  title: "সাইন ইন — বাজার দর",
};

export default async function SignInPage() {
  await connection();
  return (
    <AuthForm
      githubEnabled={Boolean(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET)}
      googleEnabled={Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET)}
      mode="signin"
    />
  );
}
