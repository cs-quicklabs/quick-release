import React, {
  useState,
  useMemo,
  useRef,
  useEffect,
  useCallback,
} from "react";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { requestHandler, updateQueryParams } from "@/Utils";
import {
    getAllPublicFeedbacksRequest,
} from "@/fetchHandlers/feedbacks";
import { useProjectContext } from "@/app/context/ProjectContext";
import { FilterType } from "@/types";

export default function FeedbackSearchWithAutocomplete({
  board,
  status,
}: {
  board?: string;
  status?: string;
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState(
    useMemo(() => {
      const data = searchParams.get("search");
      if (data && data !== "") {
        return searchParams.get("search");
      }
      return "";
    }, [searchParams])
  );
  const { projectName } = useParams();
  const [suggestions, setSuggestions] = useState<string[]>([]); // Suggestions state
  const [showSuggestions, setShowSuggestions] = useState(false); // Control visibility of suggestions
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { activeProjectId } = useProjectContext();

  // Debounce function to prevent rapid API calls
  const debounce = (func: (...args: any[]) => void, delay: number) => {
    let timer: NodeJS.Timeout;
    return (...args: any[]) => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  };

  // Fetch suggestions from API
  const fetchSuggestions = useCallback(
    async (query: string) => {
      if (!query || query.length < 3) return;

      let params: FilterType = { projectsId: activeProjectId! };

      if (board) params.feedbackBoards = board;
      if (status) params.feedbackStatus = status;
      await requestHandler(
        async () =>
          await getAllPublicFeedbacksRequest({
            projectName,
            search: query,
            limit: 5,
          }),
        setLoading,
        (res) => {
          const { data } = res;
          setSuggestions(
            data.feedbackPosts.map((feedbackPost: any) => feedbackPost.title)
          );
          setShowSuggestions(true);
        },
        () => {
          setSuggestions([]);
          setShowSuggestions(false);
        }
      );
    },
    [searchQuery]
  );

  // Debounced API call
  const debouncedFetchSuggestions = useCallback(
    debounce(fetchSuggestions, 300),
    []
  );

  useEffect(() => {
    if (searchQuery) {
      debouncedFetchSuggestions(searchQuery);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchQuery, debouncedFetchSuggestions]);

  const onSearch = (searchInput: string) => {
    const queryParams = updateQueryParams(board!, searchInput, null);
    router.push(`${pathname}?${queryParams}`);
    setShowSuggestions(false);
  };

  return (
    <div className="relative w-full md:w-[25rem]">
      {/* Input Field */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3">
          <MagnifyingGlassIcon
            className="h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </div>
        <input
          id="search"
          name="search"
          value={searchQuery!}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSearch(searchQuery!)}
          className="border border-gray-300 rounded-md py-2 pl-10 pr-3 w-full leading-5 text-gray-600 placeholder-gray-400 sm:text-sm"
          placeholder="Search feedbacks"
        />

        {/* Clear Button */}
        {searchQuery && (
          <button
            type="button"
            onClick={() => {
              setSearchQuery(""); // Clear input
              onSearch("");
              setShowSuggestions(false); // Hide suggestions
            }}
            className="absolute inset-y-0 right-0 flex items-center pr-3"
          >
            <XMarkIcon className="h-5 w-5 text-gray-400" />
          </button>
        )}
      </div>

      {/* Autocomplete Suggestions */}
      {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {loading ? (
            <li className="p-2 text-gray-500">Loading...</li>
          ) : (
            suggestions.map((suggestion, index) => (
              <li
                key={index}
                onClick={() => onSearch(suggestion)} // Trigger search on click
                className="cursor-pointer px-4 py-2 hover:bg-gray-100 sm:text-sm"
              >
                {suggestion}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
