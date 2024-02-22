const shimmer =
  "before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent";

export function PostSkeleton() {
  return (
    <div
      className={`${shimmer} relative overflow-hidden rounded-xl bg-slate-800 p-2 shadow-sm mb-8`}
    >
      <div className="flex p-4">
        <div className="h-5 w-5 rounded-md bg-slate-600" />
        <div className="ml-2 h-6 w-16 rounded-md bg-slate-600 text-sm font-medium" />
      </div>
      <div className="flex items-center justify-center truncate rounded-xl bg-slate-500 px-4 py-8">
        <div className="h-7 w-20 rounded-md bg-slate-600" />
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
