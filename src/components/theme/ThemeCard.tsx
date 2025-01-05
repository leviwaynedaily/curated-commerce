import { Button } from "@/components/ui/button";
import { ThemePreview } from "./ThemePreview";
import { Tables } from "@/integrations/supabase/types";

interface ThemeCardProps {
  theme: Tables<"themes">;
  isSelected: boolean;
  onApply: (themeId: string) => void;
}

export function ThemeCard({ theme, isSelected, onApply }: ThemeCardProps) {
  return (
    <div
      className={`border rounded-lg p-4 transition-all ${
        isSelected ? "ring-2 ring-primary" : "hover:border-primary"
      }`}
    >
      <ThemePreview 
        theme={{
          name: theme.name,
          layout_config: theme.layout_config as any
        }} 
      />
      <div className="mt-4 space-y-4">
        <div>
          <h3 className="font-semibold">{theme.name}</h3>
          {theme.description && (
            <p className="text-sm text-muted-foreground">
              {theme.description}
            </p>
          )}
        </div>
        <Button 
          onClick={() => onApply(theme.id)}
          className="w-full"
          variant={isSelected ? "secondary" : "default"}
        >
          {isSelected ? "Theme Applied" : "Apply Theme"}
        </Button>
      </div>
    </div>
  );
}