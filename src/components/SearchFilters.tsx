import { useState } from "react";
import { Filter, ChevronDown, X } from "lucide-react";
import { ALL_TAGS } from "@/lib/constants";
import type { DifficultyFilter, SortOption } from "@/types/recipe";
import { motion, AnimatePresence } from "framer-motion";

interface SearchFiltersProps {
  selectedTags: string[];
  onToggleTag: (tag: string) => void;
  difficulty: DifficultyFilter;
  onDifficultyChange: (d: DifficultyFilter) => void;
  maxTime: number;
  onMaxTimeChange: (t: number) => void;
  sortBy: SortOption;
  onSortChange: (s: SortOption) => void;
  resultCount: number;
}

const difficulties: DifficultyFilter[] = ["All", "Easy", "Medium", "Hard"];
const sortOptions: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "rating", label: "Top Rated" },
  { value: "quickest", label: "Quickest" },
];

const SearchFilters = ({
  selectedTags,
  onToggleTag,
  difficulty,
  onDifficultyChange,
  maxTime,
  onMaxTimeChange,
  sortBy,
  onSortChange,
  resultCount,
}: SearchFiltersProps) => {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border bg-card text-card-foreground hover:bg-muted transition-colors text-sm font-medium"
          >
            <Filter className="h-4 w-4" />
            Filters
            {selectedTags.length > 0 && (
              <span className="bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded-full">
                {selectedTags.length}
              </span>
            )}
            <ChevronDown className={`h-3.5 w-3.5 transition-transform ${showFilters ? "rotate-180" : ""}`} />
          </button>
          <p className="text-sm text-muted-foreground">
            {resultCount} recipe{resultCount !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="flex items-center gap-1 rounded-lg border bg-card p-1">
          {sortOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onSortChange(opt.value)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                sortBy === opt.value
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-5 rounded-xl bg-card border space-y-5">
              <div>
                <h4 className="text-sm font-semibold text-card-foreground mb-2">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {ALL_TAGS.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => onToggleTag(tag)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                        selectedTags.includes(tag)
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-background text-muted-foreground border-border hover:border-primary hover:text-primary"
                      }`}
                    >
                      {tag}
                      {selectedTags.includes(tag) && <X className="inline-block h-3 w-3 ml-1" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-6">
                <div>
                  <h4 className="text-sm font-semibold text-card-foreground mb-2">Difficulty</h4>
                  <div className="flex gap-1">
                    {difficulties.map((d) => (
                      <button
                        key={d}
                        onClick={() => onDifficultyChange(d)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                          difficulty === d
                            ? "bg-secondary text-secondary-foreground"
                            : "text-muted-foreground hover:bg-muted"
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-card-foreground mb-2">
                    Max Time: {maxTime === 120 ? "Any" : `${maxTime} min`}
                  </h4>
                  <input
                    type="range"
                    min={10}
                    max={120}
                    step={5}
                    value={maxTime}
                    onChange={(e) => onMaxTimeChange(Number(e.target.value))}
                    className="w-48 accent-primary"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchFilters;
