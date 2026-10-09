export default function AuthSkeleton() {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-180px)] w-full max-w-5xl flex-col items-center px-4 py-10">
      <div className="mb-5 h-7 w-44 animate-pulse rounded bg-[#e1e9e2]" />
      <div className="mb-6 h-4 w-64 animate-pulse rounded bg-[#e8eee9]" />
      <div className="w-full max-w-md space-y-4 rounded-xl border border-bazaar-border bg-white p-6 shadow-sm">
        <div className="h-4 w-20 animate-pulse rounded bg-[#e8eee9]" />
        <div className="h-10 animate-pulse rounded-md bg-[#f1f5f1]" />
        <div className="h-4 w-20 animate-pulse rounded bg-[#e8eee9]" />
        <div className="h-10 animate-pulse rounded-md bg-[#f1f5f1]" />
        <div className="h-10 animate-pulse rounded-md bg-[#d9eee0]" />
        <div className="h-10 animate-pulse rounded-md bg-[#f1f5f1]" />
      </div>
    </main>
  );
}
