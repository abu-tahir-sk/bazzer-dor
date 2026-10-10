import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "../lib/auth";



export default async function ProfilePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/signin?error=protected");
  }

  const { user } = session;

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-12">
      <div className="rounded-2xl border border-bazaar-border bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-2xl font-extrabold text-[#25372c] mb-6">আমার প্রোফাইল</h1>
        
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            {user.image ? (
              <img src={user.image} alt="" className="size-16 rounded-full object-cover" />
            ) : (
              <span aria-hidden="true" className="grid size-16 place-items-center rounded-full bg-[#e6f2e9] text-2xl text-[#176c45] font-bold">
                {(user.name || user.email || "U").slice(0, 1).toUpperCase()}
              </span>
            )}
            <div>
              <p className="text-xl font-bold text-[#203d2b] m-0">{user.name || "ব্যবহারকারী"}</p>
              <p className="text-sm text-bazaar-muted m-0 mt-1">{user.email}</p>
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-[#edf1ed]">
            <Link
              href="/profile/edit"
              className="inline-flex items-center justify-center rounded-lg bg-[#f0f2f1] px-5 py-2.5 text-sm font-bold text-[#25372c] no-underline hover:bg-[#e2e6e3] transition"
            >
              তথ্য আপডেট করুন
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
