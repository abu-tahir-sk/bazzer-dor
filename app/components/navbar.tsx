"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Store } from "lucide-react";
import { authClient } from "../lib/auth-client";
import { usePathname } from "next/navigation";
import { useToast } from "./toast-provider";

const categories = [
  { name: "চাল", slug: "chal", emoji: "🍚" },
  { name: "ডাল", slug: "dal", emoji: "🫘" },
  { name: "তেল", slug: "tel", emoji: "🫙" },
  { name: "সবজি", slug: "sobji", emoji: "🥬" },
  { name: "মাছ", slug: "mach", emoji: "🐟" },
  { name: "মাংস", slug: "mangsho", emoji: "🍗" },
  { name: "ডিম ও দুধ", slug: "dim-dui", emoji: "🥚" },
  { name: "মসলা", slug: "mosla", emoji: "🌶️" },
];

const banglaDateFormatter = new Intl.DateTimeFormat("bn-BD", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "Asia/Dhaka",
});

const marketPrices = [
  { emoji: "🥔", name: "আলু", price: "৳৪০", unit: "কেজি", trend: "up", change: "২.৫%" },
  { emoji: "🧅", name: "পেঁয়াজ", price: "৳৬০", unit: "কেজি", trend: "down", change: "১.২%" },
  { emoji: "🥚", name: "ডিম", price: "৳১২", unit: "টি", trend: "up", change: "০.৮%" },
  { emoji: "🍅", name: "টমেটো", price: "৳৫০", unit: "কেজি", trend: "down", change: "৩.১%" },
  { emoji: "🍚", name: "চাল", price: "৳৬৮", unit: "কেজি", trend: "up", change: "১.৪%" },
  { emoji: "🐟", name: "রুই মাছ", price: "৳৩৫০", unit: "কেজি", trend: "down", change: "০.৬%" },
];

function PriceItems() {
  return marketPrices.map((item) => (
    <span className="inline-flex shrink-0 items-center gap-1.5 border-r border-[#e0e8e2] px-3 text-[9px] whitespace-nowrap" key={item.name}>
      <span aria-hidden="true" className="text-[11px]">{item.emoji}</span>
      <span>{item.name}</span>
      <span>{item.price}/{item.unit}</span>
      <span className={item.trend === "up" ? "font-bold text-bazaar-green" : "font-bold text-[#d9433e]"}>
        <span aria-hidden="true">{item.trend === "up" ? "▲" : "▼"}</span> {item.change}
      </span>
    </span>
  ));
}

export default function Navbar() {
  const pathname = usePathname();
  const [banglaDate, setBanglaDate] = useState("");
  const [isSigningOut, setIsSigningOut] = useState(false);
  const { data: session, isPending } = authClient.useSession();
  const { showToast } = useToast();

  useEffect(() => {
    const timeoutId = window.setTimeout(
      () => setBanglaDate(banglaDateFormatter.format(new Date())),
      0,
    );

    return () => window.clearTimeout(timeoutId);
  }, []);

  return (
    <header className="w-full border-b border-[#e7ede9] bg-bazaar-surface text-bazaar-ink">
      <div className="mx-auto w-full max-w-6xl px-4">
        <div className="flex min-h-[42px] items-center justify-between gap-4 border-b border-[#edf1ee]">
          <div className="flex flex-col items-start">
            <Link aria-label="বাজার দর হোম" className="inline-flex items-center gap-1.5 text-[13px] font-extrabold text-[#17251d] no-underline" href="/">
              <span aria-hidden="true" className="grid size-6 place-items-center rounded-[7px] bg-bazaar-green text-white">
                <Store aria-hidden="true" size={14} strokeWidth={2} />
              </span>
              <span>বাজার দর</span>
            </Link>
            <p className="mb-0 ml-[29px] text-[8px] text-[#727c75]">{banglaDate}</p>
          </div>

          {isPending ? (
            <div aria-label="অ্যাকাউন্ট লোড হচ্ছে" className="flex items-center gap-2.5">
              <span className="h-7 w-14 animate-pulse rounded bg-[#e8eee9]" />
              <span className="h-7 w-16 animate-pulse rounded bg-[#d9eee0]" />
            </div>
          ) : session?.user ? (
            <div className="flex items-center justify-end gap-2.5">
              <Link className="inline-flex items-center gap-1.5 text-[10px] font-bold text-[#294638] no-underline hover:text-bazaar-green" href="/profile">
                {session.user.image ? (
                  <img src={session.user.image} alt="" className="size-6 rounded-full object-cover" />
                ) : (
                  <span aria-hidden="true" className="grid size-6 place-items-center rounded-full bg-[#e6f2e9] text-[#176c45]">
                    {(session.user.name || session.user.email || "U").slice(0, 1).toUpperCase()}
                  </span>
                )}
                <span>{session.user.name || "ব্যবহারকারী"}</span>
              </Link>
              <button
                className="inline-flex min-h-7 items-center justify-center rounded-md border-0 bg-transparent px-2.5 text-[10px] font-bold text-bazaar-ink hover:text-bazaar-green disabled:opacity-60"
                disabled={isSigningOut}
                onClick={async () => {
                  setIsSigningOut(true);
                  try {
                    const result = await authClient.signOut();
                    if (result.error) throw new Error(result.error.message);
                    showToast("সফলভাবে সাইন আউট হয়েছে।");
                  } catch (error) {
                    showToast(
                      error instanceof Error ? error.message : "সাইন আউট করা যায়নি।",
                      "error",
                    );
                  } finally {
                    setIsSigningOut(false);
                  }
                }}
                type="button"
              >
                {isSigningOut ? "অপেক্ষা করুন…" : "সাইন আউট"}
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-end gap-2.5">
              <Link className="inline-flex min-h-7 items-center justify-center rounded-md px-2.5 text-[10px] font-bold text-bazaar-ink no-underline hover:text-bazaar-green" href="/signin">সাইন ইন</Link>
              <Link className="inline-flex min-h-7 items-center justify-center rounded-md border border-bazaar-green bg-bazaar-green px-2.5 text-[10px] font-bold text-white no-underline hover:bg-bazaar-green-dark" href="/signup">সাইন আপ</Link>
            </div>
          )}
        </div>

        <nav aria-label="পণ্যের বিভাগ" className="flex min-h-[30px] items-center justify-start gap-[clamp(10px,2vw,22px)] overflow-x-auto sm:justify-center">
          {categories.map((category) => {
            const isActive = pathname === `/category/${category.slug}`;
            return (
              <Link
                aria-current={isActive ? "page" : undefined}
                className={`inline-flex shrink-0 items-center gap-1 border-0 bg-transparent p-[3px] text-[10px] text-[#48564d] no-underline hover:text-bazaar-green ${isActive ? "font-extrabold text-bazaar-green" : ""}`}
                href={`/category/${category.slug}`}
                key={category.slug}
              >
                <span aria-hidden="true" className="text-[10px]">{category.emoji}</span>
                {category.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div aria-label="বাজারদরের নমুনা মূল্য" className="flex min-h-8 items-center overflow-hidden border-y border-[#e8eeea] bg-[#f7faf8]">
        <div className="flex w-max animate-bazaar-ticker hover:[animation-play-state:paused]">
          <div className="flex shrink-0 items-center"><PriceItems /></div>
          <div aria-hidden="true" className="flex shrink-0 items-center"><PriceItems /></div>
        </div>
      </div>
    </header>
  );
}
