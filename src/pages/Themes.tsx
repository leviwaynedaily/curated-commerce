import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Upload } from "lucide-react";
import { useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { ThemePreview } from "@/components/theme/ThemePreview";
import { z } from "zod";
import { ThemeConfig } from "@/types/theme";

// Schema for theme validation
const themeConfigSchema = z.object({
  colors: z.object({
    background: z.object({
      primary: z.string(),
      secondary: z.string(),
      accent: z.string(),
    }),
    font: z.object({
      primary: z.string(),
      secondary: z.string(),
      highlight: z.string(),
    }),
  }),
});

const Themes = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);

  // Fetch themes
  const { data: themes, refetch: refetchThemes } = useQuery({
    queryKey: ["themes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("themes")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const content = await file.text();
      const themeData = JSON.parse(content);

      // Validate theme structure
      themeConfigSchema.parse(themeData);

      const { error } = await supabase.from("themes").insert({
        name: file.name.replace(".json", ""),
        layout_config: themeData,
        category: "grid", // Default category
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Theme imported successfully",
      });

      refetchThemes();
    } catch (error) {
      console.error("Error importing theme:", error);
      toast({
        title: "Error",
        description: "Invalid theme file format",
        variant: "destructive",
      });
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Themes</h1>
            <p className="text-muted-foreground mt-2">
              Import and manage your storefront themes
            </p>
          </div>
          <div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImport}
              accept=".json"
              className="hidden"
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              className="gap-2"
            >
              <Upload className="h-4 w-4" />
              Import Theme
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {themes?.map((theme) => (
            <div
              key={theme.id}
              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                selectedTheme === theme.id
                  ? "ring-2 ring-primary"
                  : "hover:border-primary"
              }`}
              onClick={() => setSelectedTheme(theme.id)}
            >
              <ThemePreview 
                theme={{
                  name: theme.name,
                  layout_config: theme.layout_config as ThemeConfig
                }} 
              />
              <div className="mt-4">
                <h3 className="font-semibold">{theme.name}</h3>
                {theme.description && (
                  <p className="text-sm text-muted-foreground">
                    {theme.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Themes;