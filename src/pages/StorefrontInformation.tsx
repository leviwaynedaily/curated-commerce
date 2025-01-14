import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { StorefrontBasicInfo } from "@/components/storefront/StorefrontBasicInfo"
import { StorefrontInstructions } from "@/components/storefront/StorefrontInstructions"
import { StorefrontVerification } from "@/components/storefront/StorefrontVerification"
import { useForm } from "react-hook-form"
import { useStorefront } from "@/hooks/useStorefront"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export default function StorefrontInformation() {
  const currentStorefrontId = localStorage.getItem('lastStorefrontId');
  const { data: storefront, isLoading, error } = useStorefront(currentStorefrontId);
  
  const form = useForm({
    defaultValues: {
      name: "",
      description: "",
      logo_url: "",
      favicon_url: "",
      show_description: false,
      verification_type: "none",
      verification_password: "",
      verification_age: 21,
      verification_age_text: "",
      verification_legal_text: "",
      verification_logo_url: "",
      enable_instructions: false,
      instructions_text: "",
    }
  });

  // Update form values when storefront data is loaded
  React.useEffect(() => {
    if (storefront) {
      form.reset({
        name: storefront.name || "",
        description: storefront.description || "",
        logo_url: storefront.logo_url || "",
        favicon_url: storefront.favicon_url || "",
        show_description: storefront.show_description || false,
        verification_type: storefront.verification_type || "none",
        verification_password: storefront.verification_password || "",
        verification_age: storefront.verification_age || 21,
        verification_age_text: storefront.verification_age_text || "",
        verification_legal_text: storefront.verification_legal_text || "",
        verification_logo_url: storefront.verification_logo_url || "",
        enable_instructions: storefront.enable_instructions || false,
        instructions_text: storefront.instructions_text || "",
      });
    }
  }, [storefront, form]);

  if (!currentStorefrontId) {
    return (
      <DashboardLayout>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            No storefront selected. Please select a storefront first.
          </AlertDescription>
        </Alert>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <StorefrontBasicInfo form={form} />
        <StorefrontInstructions form={form} />
        <StorefrontVerification form={form} />
      </div>
    </DashboardLayout>
  )
}