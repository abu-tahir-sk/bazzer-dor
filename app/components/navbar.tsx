"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./navbar.module.css";

const categories = ["সব পণ্য", "শাকসবজি", "ফলমূল", "মাছ ও মাংস", "মুদি পণ্য"];

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

type NavbarUser = { name: string };

type NavbarProps =
  | { user?: null }
  | { user: NavbarUser; onSignOut: () => void };

function PriceItems() {
  return marketPrices.map((item) => (
    <span className={styles.priceItem} key={item.name}>
      <span aria-hidden="true" className={styles.priceEmoji}>{item.emoji}</span>
      <span className={styles.priceName}>{item.name}</span>
      <span className={styles.priceValue}>{item.price}/{item.unit}</span>
      <span className={item.trend === "up" ? styles.priceUp : styles.priceDown}>
        <span aria-hidden="true">{item.trend === "up" ? "▲" : "▼"}</span> {item.change}
      </span>
    </span>
  ));
}

export default function Navbar(props: NavbarProps = {}) {
  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const [banglaDate, setBanglaDate] = useState("");

  useEffect(() => {
    const timeoutId = window.setTimeout(
      () => setBanglaDate(banglaDateFormatter.format(new Date())),
      0,
    );

    return () => window.clearTimeout(timeoutId);
  }, []);

  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        <div className={styles.topRow}>
          <div className={styles.brandBlock}>
            <Link aria-label="বাজার দর হোম" className={styles.brand} href="/">
              <span aria-hidden="true" className={styles.brandIcon}>🛒</span>
              <span>বাজার দর</span>
            </Link>
            <p className={styles.date}>{banglaDate}</p>
          </div>

          {"user" in props && props.user ? (
            <div className={styles.accountActions}>
              <Link className={styles.profileLink} href="/profile">
                <span aria-hidden="true" className={styles.avatar}>
                  {props.user.name.slice(0, 1)}
                </span>
                <span>{props.user.name}</span>
              </Link>
              <button className={styles.signOutButton} onClick={props.onSignOut} type="button">
                সাইন আউট
              </button>
            </div>
          ) : (
            <div className={styles.accountActions}>
              <Link className={styles.signInButton} href="/sign-in">সাইন ইন</Link>
              <Link className={styles.signUpButton} href="/sign-up">সাইন আপ</Link>
            </div>
          )}
        </div>

        <nav aria-label="পণ্যের বিভাগ" className={styles.categoryNav}>
          {categories.map((category) => (
            <button
              aria-current={activeCategory === category ? "page" : undefined}
              className={`${styles.categoryLink} ${activeCategory === category ? styles.activeCategory : ""}`}
              key={category}
              onClick={() => setActiveCategory(category)}
              type="button"
            >
              {category}
            </button>
          ))}
        </nav>
      </div>

      <div aria-label="বাজারদরের নমুনা মূল্য" className={styles.ticker}>
        <div className={styles.tickerTrack}>
          <div className={styles.tickerGroup}><PriceItems /></div>
          <div aria-hidden="true" className={styles.tickerGroup}><PriceItems /></div>
        </div>
      </div>
    </header>
  );
}
