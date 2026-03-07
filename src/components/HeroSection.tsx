import { motion } from "framer-motion";
import { Search } from "lucide-react";
import heroImage from "@/assets/hero-food.jpg";

interface HeroSectionProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

const HeroSection = ({ searchQuery, onSearchChange }: HeroSectionProps) => {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <img src={heroImage} alt="Fresh ingredients on rustic table" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/40 to-foreground/20" />
      </div>

      <div className="relative container mx-auto px-4 py-24 md:py-36">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="max-w-2xl"
        >
          <h1 className="text-4xl md:text-6xl font-display font-bold text-primary-foreground leading-tight mb-4">
            Cook with
            <span className="italic text-warm"> Passion</span>,
            <br />Share with Love
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/80 font-body mb-8 max-w-lg">
            Discover recipes from passionate home cooks, build your cookbooks, and plan meals effortlessly.
          </p>

          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search recipes, ingredients, tags..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-xl bg-background/95 backdrop-blur-sm text-foreground placeholder:text-muted-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 font-body text-base"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
