import { UseFormReturn } from "react-hook-form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface PWAFormValidationProps {
  form: UseFormReturn<any>;
}

export function PWAFormValidation({ form }: PWAFormValidationProps) {
  const missingRequirements = [
    !form.getValues("name") && "App name",
    !form.getValues("short_name") && "Short name",
    !form.getValues("icon_192x192") && "192x192 icon",
    !form.getValues("icon_512x512") && "512x512 icon",
  ].filter(Boolean);

  if (missingRequirements.length === 0) return null;

  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Missing Required Fields</AlertTitle>
      <AlertDescription>
        The following fields are required to create a PWA manifest:
        <ul className="list-disc list-inside mt-2">
          {missingRequirements.map((req) => (
            <li key={req}>{req}</li>
          ))}
        </ul>
      </AlertDescription>
    </Alert>
  );
}