import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { StorefrontBasicInfo } from "@/components/storefront/StorefrontBasicInfo";
import { StorefrontVerification } from "@/components/storefront/StorefrontVerification";
import { StorefrontInstructions } from "@/components/storefront/StorefrontInstructions";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const formSchema = z.object({
  name: z.string().min(1, "Site name is required"),
  logo_url: z.string().nullable(),
  description: z.string().nullable(),
  show_description: z.boolean().default(false),
  verification_type: z.enum(["none", "age", "password", "both"]).default("none"),
  verification_logo_url: z.string().nullable(),
  verification_age: z.number().default(21),
  verification_age_text: z.string().default("I confirm that I am 21 years of age or older and agree to the Terms of Service and Privacy Policy."),
  verification_password: z.string().nullable(),
  verification_legal_text: z.string().default("This website contains age-restricted content. By entering, you accept our terms and confirm your legal age to view such content."),
  enable_instructions: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

const StorefrontInformation = () => {
  const { toast } = useToast();
  const currentStorefrontId = localStorage.getItem('lastStorefrontId');

  const { data: storefront, isLoading } = useQuery({
    queryKey: ["storefront", currentStorefrontId],
    queryFn: async () => {
      console.log("Fetching storefront with ID:", currentStorefrontId);
      
      if (!currentStorefrontId) {
        throw new Error("No storefront selected");
      }

      const { data, error } = await supabase
        .from("storefronts")
        .select("*")
        .eq("id", currentStorefrontId)
        .maybeSingle();

      if (error) {
        console.error("Error fetching storefront:", error);
        throw error;
      }

      if (!data) {
        throw new Error("Storefront not found");
      }

      console.log("Fetched storefront:", data);
      return data;
    },
    enabled: !!currentStorefrontId,
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: storefront?.name || "",
      logo_url: storefront?.logo_url || null,
      description: storefront?.description || "",
      show_description: storefront?.show_description || false,
      verification_type: storefront?.verification_type || "none",
      verification_logo_url: null,
      verification_age: storefront?.verification_age || 21,
      verification_age_text: "I confirm that I am 21 years of age or older and agree to the Terms of Service and Privacy Policy.",
      verification_password: storefront?.verification_password || null,
      verification_legal_text: "This website contains age-restricted content. By entering, you accept our terms and confirm your legal age to view such content.",
      enable_instructions: false,
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      if (!currentStorefrontId) {
        throw new Error("No storefront selected");
      }

      const { error } = await supabase
        .from("storefronts")
        .update({
          name: values.name,
          logo_url: values.logo_url,
          description: values.description,
          show_description: values.show_description,
          verification_type: values.verification_type,
          verification_age: values.verification_age,
          verification_password: values.verification_password,
        })
        .eq("id", currentStorefrontId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Storefront information updated successfully",
      });
    } catch (error) {
      console.error("Error updating storefront:", error);
      toast({
        title: "Error",
        description: "Failed to update storefront information",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div>Loading...</div>
      </DashboardLayout>
    );
  }

  if (!currentStorefrontId) {
    return (
      <DashboardLayout>
        <div>Please select a storefront first</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Storefront Information</h1>
          <p className="text-muted-foreground mt-2">
            Customize how your storefront appears to customers.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <StorefrontBasicInfo form={form} />
            
            <Separator className="my-8" />
            
            <StorefrontVerification form={form} />
            
            <Separator className="my-8" />
            
            <StorefrontInstructions form={form} />

            <Button type="submit" className="ml-auto">
              Save Changes
            </Button>
          </form>
        </Form>
      </div>
    </DashboardLayout>
  );
};

export default StorefrontInformation;