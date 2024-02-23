"use client";

import { ChangeEvent, FC, useState } from "react";
import { Search as SearchIcon } from "lucide-react";
import { useDebouncedCallback } from "use-debounce";
import { trpc } from "~/app/_trpc/client";
import SearchResult, { SearchResultSkeleton } from "./SearchResult";

interface SearchProps {}

const Search: FC<SearchProps> = ({}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const { data, isPending, error } =
    trpc.getFilteredCommunities.useQuery(searchTerm);

  const handleSearch = useDebouncedCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);
    },
    300
  );

  return (
    <div className="relative">
      {isOpen && (
        <>
          <div
            className="fixed top-0 left-0 w-full h-screen z-10 bg-slate-700 opacity-35 backdrop-blur-md"
            onClick={() => {
              setIsOpen(false);
            }}
          />
          <div className="z-20 w-[60vw] min-h-24 fixed top-24 left-1/2 -translate-x-1/2 bg-gray-700 rounded-md flex flex-col justify-start items-center p-4">
            <input
              autoFocus
              type="serach"
              placeholder="Search for communities..."
              className="w-full p-4 rounded-md bg-slate-900 text-slate-300"
              onChange={handleSearch}
            />
            {searchTerm?.length > 0 && (
              <>
                <p className="mt-2 self-start text-slate-200">Results</p>
                <div className="w-full" onClick={() => setIsOpen(false)}>
                  {isPending && (
                    <div className="mt-2 w-full">
                      <SearchResultSkeleton />
                      <SearchResultSkeleton />
                    </div>
                  )}
                  {error && <p>Error: {error.message}</p>}
                  {data && (
                    <ul className="w-full mt-2">
                      {data.map((community) => (
                        <li key={community.id} className="w-full mb-2">
                          <SearchResult
                            id={community.id}
                            name={community.name}
                            description={community.description}
                          />
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </>
            )}
          </div>
        </>
      )}
      <div
        className="p-4 bg-slate-500 hover:bg-slate-600 cursor-pointer grid place-content-center rounded-md"
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        <SearchIcon size={20} />
      </div>
    </div>
  );
};

export default Search;
