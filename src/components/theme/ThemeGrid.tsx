import { ThemeCard } from "./ThemeCard";
import { Tables } from "@/integrations/supabase/types";

interface ThemeGridProps {
  themes: Tables<"themes">[];
  selectedThemeId: string | null;
  onApplyTheme: (themeId: string) => void;
}

export function ThemeGrid({ themes, selectedThemeId, onApplyTheme }: ThemeGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {themes?.map((theme) => (
        <ThemeCard
          key={theme.id}
          theme={theme}
          isSelected={selectedThemeId === theme.id}
          onApply={onApplyTheme}
        />
      ))}
    </div>
  );
}