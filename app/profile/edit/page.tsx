import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "../../lib/auth";
import { ProfileEditForm } from "./profile-edit-form";

export const instant = false;

export default async function EditProfilePage() {
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
        <h1 className="text-2xl font-extrabold text-[#25372c]">তথ্য আপডেট করুন</h1>
        <p className="mt-2 text-sm text-bazaar-muted">আপনার নাম পরিবর্তন করতে পারবেন।</p>
        
        <ProfileEditForm initialName={user.name} />
      </div>
    </main>
  );
}
