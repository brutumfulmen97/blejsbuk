import { Link } from "next-view-transitions";
import { FC } from "react";

interface SearchResultProps {
  name: string;
  description: string;
  id: string;
}

const SearchResult: FC<SearchResultProps> = ({ name, description, id }) => {
  return (
    <Link
      href={`/community/${id}`}
      replace={true}
      className="p-2 bg-slate-800 hover:bg-slate-900 rounded-md w-full block"
    >
      <p className="text-slate-200 truncate">
        r/{name}, <span className="text-slate-400">{description}</span>
      </p>
    </Link>
  );
};

export default SearchResult;

const shimmer =
  "before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent";

export function SearchResultSkeleton() {
  return (
    <div
      className={`${shimmer} relative overflow-hidden rounded-xl bg-slate-800 p-2 shadow-sm mb-2`}
    >
      <div className="flex p-2">
        <div className="h-5 w-5 rounded-md bg-slate-600" />
      </div>
    </div>
  );
}
