"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "../../lib/auth-client";
import { useToast } from "../../components/toast-provider";

export function ProfileEditForm({ initialName }: { initialName: string }) {
  const [name, setName] = useState(initialName);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { showToast } = useToast();

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      showToast("নাম ফাঁকা রাখা যাবে না", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await authClient.updateUser({
        name: name.trim(),
      });
      if (result.error) {
        throw new Error(result.error.message);
      }
      showToast("প্রোফাইল সফলভাবে আপডেট হয়েছে");
      router.push("/profile");
      router.refresh();
    } catch (error) {
      showToast(error instanceof Error ? error.message : "আপডেট ব্যর্থ হয়েছে", "error");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleUpdate} className="space-y-4 mt-6">
      <div>
        <label className="text-xs font-semibold text-[#34443a]" htmlFor="name">নাম</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          maxLength={80}
          minLength={2}
          className="mt-1 block w-full rounded-md border border-bazaar-border bg-white px-3 py-2.5 text-sm text-bazaar-ink outline-none transition focus:border-bazaar-green focus:ring-2 focus:ring-bazaar-green/15"
        />
      </div>

      <div className="pt-4 flex gap-3">
        <button
          type="submit"
          disabled={isSubmitting || name === initialName}
          className="flex min-h-11 items-center justify-center rounded-md bg-[#168b49] px-6 py-2.5 text-sm font-bold text-white shadow-[0_3px_0_#d4e8da] transition hover:bg-[#117c40] disabled:cursor-not-allowed disabled:opacity-65"
        >
          {isSubmitting ? "অপেক্ষা করুন…" : "আপডেট করুন"}
        </button>
        <Link
          href="/profile"
          className="flex min-h-11 items-center justify-center rounded-md bg-[#f0f2f1] px-6 py-2.5 text-sm font-bold text-[#25372c] no-underline hover:bg-[#e2e6e3] transition"
        >
          বাতিল
        </Link>
      </div>
    </form>
  );
}
