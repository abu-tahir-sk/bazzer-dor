import Image from "next/image";

export default function Banner() {
  return (
    <section aria-labelledby="bazaar-banner-title" className="my-5 grid grid-cols-1 items-center gap-6 overflow-hidden rounded-2xl border border-[#e2ece2] bg-[linear-gradient(120deg,#f4faf2,#e7f4e8)] p-5 sm:p-8 lg:grid-cols-[minmax(0,1fr)_315px] lg:gap-10 lg:px-12 lg:py-8">
      <div className="max-w-2xl">
        <p className="mb-2 text-xs font-bold text-bazaar-green sm:text-sm">শুক্রবার, ৯ অক্টোবর, ২০২৬</p>
        <h1 className="mb-3 text-3xl leading-tight font-extrabold text-[#193b28] sm:text-4xl lg:text-[42px]" id="bazaar-banner-title">আজকের বাজারের দাম এক নজরে</h1>
        <p className="mb-5 max-w-xl text-sm leading-7 text-[#52645a] sm:text-base">
          চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম — বাজারভিত্তিক
          বিশ্লেষণ, সহজ, সর্বনিম্ন-সর্বোচ্চ এবং দামের পরিবর্তন এক জায়গায়।
        </p>
        <a className="inline-flex min-h-11 items-center justify-center rounded-lg bg-bazaar-green px-5 py-2.5 text-sm font-bold text-white no-underline shadow-sm transition hover:bg-bazaar-green-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bazaar-green" href="#সব-পণ্য">
          সব পণ্য দেখুন
        </a>
      </div>

      <Image
        alt="তাজা সবজির ঝুড়ি"
        className="mx-auto h-auto w-full max-w-[315px] object-contain lg:justify-self-end"
        src="/basket-vegetables.png"
        width={315}
        height={263}
        priority
      />
    </section>
  );
}
