
import { categories } from "@/data/eventsData";

interface CategoryFilterProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

const CategoryFilter = ({ selectedCategory, onSelectCategory }: CategoryFilterProps) => {
  return (
    <div className="flex flex-wrap gap-2 mb-8">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onSelectCategory(category)}
          className={`px-4 py-2 rounded-full text-sm ${
            selectedCategory === category
              ? "bg-ticket-purple text-white"
              : "bg-muted text-ticket-gray hover:bg-ticket-purple/10"
          } transition-colors`}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
