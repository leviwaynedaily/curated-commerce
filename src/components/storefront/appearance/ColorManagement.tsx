import { UseFormReturn } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";
import { SuggestedColorPalette } from "./SuggestedColorPalette";
import { BrandColors } from "./BrandColors";
import { VerificationColors } from "./VerificationColors";
import { ProductCardColors } from "./ProductCardColors";
import { useStorefront } from "@/hooks/useStorefront";

interface ColorManagementProps {
  form: UseFormReturn<any>;
  storefrontId: string;
  logoUrl: string | null;
}

export function ColorManagement({ form, storefrontId, logoUrl }: ColorManagementProps) {
  const { isError, isLoading } = useStorefront(storefrontId);

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load color settings. Please try refreshing the page.
        </AlertDescription>
      </Alert>
    );
  }

  // Default empty color palette
  const defaultColors = {
    primary: [],
    secondary: [],
    accent: []
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Color Management</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        <SuggestedColorPalette colors={defaultColors} logoUrl={logoUrl} />
        <BrandColors form={form} onColorChange={handleColorChange} />
        <VerificationColors form={form} onColorChange={handleColorChange} />
        <ProductCardColors form={form} onColorChange={handleColorChange} />
      </CardContent>
    </Card>
  );
}