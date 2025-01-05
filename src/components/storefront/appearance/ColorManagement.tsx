import { UseFormReturn } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { extractColors } from "@/utils/colorExtractor";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { SuggestedColorPalette } from "./SuggestedColorPalette";
import { BrandColors } from "./BrandColors";
import { VerificationColors } from "./VerificationColors";

interface ColorManagementProps {
  form: UseFormReturn<any>;
  storefrontId: string | null;
  logoUrl: string | null;
}

interface ColorPalette {
  primary: string[];
  secondary: string[];
  accent: string[];
}

export function ColorManagement({ form, storefrontId, logoUrl }: ColorManagementProps) {
  const { toast } = useToast();
  const [predefinedColors, setPredefinedColors] = useState<ColorPalette>({
    primary: [],
    secondary: [],
    accent: [],
  });

  useEffect(() => {
    const loadColors = async () => {
      if (logoUrl) {
        console.log('Initial color extraction from logo URL:', logoUrl);
        const colors = await extractColors(logoUrl);
        setPredefinedColors(colors);
      }
    };
    loadColors();
  }, [logoUrl]);

  const handleSuggestColors = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (logoUrl) {
      console.log('Suggesting colors from logo URL:', logoUrl);
      const colors = await extractColors(logoUrl);
      console.log('Generated color palette:', colors);
      setPredefinedColors(colors);
      
      toast({
        title: "Colors Generated",
        description: "Color suggestions have been generated from your logo.",
      });
    }
  };

  const handleColorChange = (field: string, value: string) => {
    form.setValue(field, value);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Color Settings</CardTitle>
          <Button
            variant="outline"
            onClick={handleSuggestColors}
            disabled={!logoUrl}
            type="button"
          >
            Suggest Colors from Logo
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-8">
        {logoUrl && (
          <div className="flex items-center space-x-4 p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">Current Logo:</p>
            <img
              src={logoUrl}
              alt="Current logo"
              className="h-12 w-auto object-contain"
            />
          </div>
        )}

        <SuggestedColorPalette colors={predefinedColors} />

        <BrandColors form={form} onColorChange={handleColorChange} />
        
        <VerificationColors form={form} onColorChange={handleColorChange} />
      </CardContent>
    </Card>
  );
}