import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface PWAFormActionsProps {
  form: UseFormReturn<any>;
  isSaving: boolean;
  onSaveDraft: () => Promise<void>;
  hasRequiredFields: boolean;
}

export function PWAFormActions({ form, isSaving, onSaveDraft, hasRequiredFields }: PWAFormActionsProps) {
  const isDirty = form.formState.isDirty;

  return (
    <div className="flex gap-4">
      <Button
        type="button"
        variant="outline"
        onClick={onSaveDraft}
        disabled={isSaving || !isDirty}
      >
        {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Save Draft
      </Button>

      <Button 
        type="submit" 
        disabled={isSaving || !hasRequiredFields}
      >
        {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Save & Create Manifest
      </Button>
    </div>
  );
}