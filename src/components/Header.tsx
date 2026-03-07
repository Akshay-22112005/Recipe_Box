import { useState } from "react";
import { ChefHat, Search, Plus, BookOpen, Calendar, Users, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface HeaderProps {
  onCreateClick: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navItems = [
  { id: "discover", label: "Discover", icon: Search },
  { id: "cookbooks", label: "Cookbooks", icon: BookOpen },
  { id: "planner", label: "Meal Planner", icon: Calendar },
  { id: "community", label: "Community", icon: Users },
];

const Header = ({ onCreateClick, activeTab, onTabChange }: HeaderProps) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 glass-surface border-b">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => onTabChange("discover")}>
          <ChefHat className="h-7 w-7 text-primary" />
          <span className="font-display text-xl font-bold text-foreground tracking-tight">
            Culina
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === item.id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <item.icon className="inline-block h-4 w-4 mr-1.5 -mt-0.5" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button onClick={onCreateClick} size="sm" className="hidden sm:flex gap-1.5">
            <Plus className="h-4 w-4" />
            New Recipe
          </Button>
          <button
            className="md:hidden p-2 rounded-lg hover:bg-muted"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t overflow-hidden"
          >
            <div className="p-4 flex flex-col gap-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => { onTabChange(item.id); setMobileOpen(false); }}
                  className={`px-4 py-3 rounded-lg text-sm font-medium text-left transition-colors ${
                    activeTab === item.id
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  <item.icon className="inline-block h-4 w-4 mr-2 -mt-0.5" />
                  {item.label}
                </button>
              ))}
              <Button onClick={() => { onCreateClick(); setMobileOpen(false); }} size="sm" className="mt-2 gap-1.5">
                <Plus className="h-4 w-4" />
                New Recipe
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
