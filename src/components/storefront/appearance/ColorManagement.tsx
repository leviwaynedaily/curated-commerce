import { UseFormReturn } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { SuggestedColorPalette } from "./SuggestedColorPalette";
import { BrandColors } from "./BrandColors";
import { VerificationColors } from "./VerificationColors";
import { ProductCardColors } from "./ProductCardColors";
import { HeaderSettings } from "./HeaderSettings";
import { ThemeConfig } from "@/types/theme";

interface ColorManagementProps {
  form: UseFormReturn<any>;
  storefrontId: string | null;
  logoUrl: string | null;
}

export function ColorManagement({ form, storefrontId, logoUrl }: ColorManagementProps) {
  const predefinedColors = {
    primary: ["#FF5733", "#33FF57"],
    secondary: ["#3357FF", "#F1C40F"],
    accent: ["#8E44AD", "#D946EF"]
  };

  const handleColorChange = (field: string, value: string) => {
    console.log(`Color changed - field: ${field}, value: ${value}`);
    // Prevent form from resetting to default values
    const currentValues = form.getValues();
    form.setValue(field, value, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true
    });
    // Ensure other form values are preserved
    Object.keys(currentValues).forEach(key => {
      if (key !== field && currentValues[key]) {
        form.setValue(key, currentValues[key], { shouldValidate: false });
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Color Management</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        <SuggestedColorPalette colors={predefinedColors} logoUrl={logoUrl} />
        <HeaderSettings form={form} />
        <BrandColors form={form} onColorChange={handleColorChange} />
        <VerificationColors form={form} onColorChange={handleColorChange} />
        <ProductCardColors form={form} onColorChange={handleColorChange} />
      </CardContent>
    </Card>
  );
}