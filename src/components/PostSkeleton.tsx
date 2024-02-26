const shimmer =
  "before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent";

export function PostSkeleton() {
  return (
    <div
      className={`${shimmer} relative overflow-hidden rounded-xl bg-slate-900 p-2 shadow-sm mb-8`}
    >
      <div className="flex p-4">
        <div className="h-12 w-5 rounded-md bg-slate-800" />
        <div className="ml-2 h-12 w-16 rounded-md bg-slate-600 text-sm font-medium" />
      </div>
      <div className="flex items-center justify-center truncate rounded-xl bg-slate-700 px-4 py-8">
        <div className="h-12 w-20 rounded-md bg-slate-700" />
      </div>
      <div className="flex gap-4 mt-4 items-center justify-center truncate rounded-xl bg-slate-700 px-4 py-8">
        <div className="h-12 w-12 rounded-md bg-slate-700" />
        <div className="h-12 w-12 rounded-md bg-slate-700" />
      </div>
    </div>
  );
}

export function PostsSkeleton() {
  return Array.from({ length: 5 }).map((_, i) => (
    <div key={i}>
      <PostSkeleton />
    </div>
  ));
}
