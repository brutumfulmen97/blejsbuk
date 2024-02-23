import { FC } from "react";
import { Search as SearchIcon } from "lucide-react";

interface SearchProps {}

const Search: FC<SearchProps> = ({}) => {
  return (
    <div className="relative">
      <div></div>
      <input type="serach" className="hidden p-4 rounded-md bg-slate-600" />
      <div className="p-4 bg-slate-500 hover:bg-slate-600 cursor-pointer grid place-content-center rounded-md">
        <SearchIcon size={20} />
      </div>
    </div>
  );
};

export default Search;
