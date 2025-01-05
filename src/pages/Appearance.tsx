import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form } from "@/components/ui/form";
import { StorefrontAppearance } from "@/components/storefront/StorefrontAppearance";
import { useToast } from "@/components/ui/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";
import { useEffect } from "react";

const formSchema = z.object({
  favicon_url: z.string().nullable(),
  logo_url: z.string().nullable(),
  main_color: z.string().default("#1A1F2C"),
  secondary_color: z.string().default("#D6BCFA"),
  font_color: z.string().default("#FFFFFF"),
  verification_color: z.string().default("#1A1F2C"),
  instructions_color: z.string().default("#1A1F2C"),
});

type FormValues = z.infer<typeof formSchema>;

const Appearance = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const currentStorefrontId = localStorage.getItem('lastStorefrontId');

  const { data: storefront, isLoading } = useQuery({
    queryKey: ["storefront", currentStorefrontId],
    queryFn: async () => {
      if (!currentStorefrontId) {
        throw new Error("No storefront selected");
      }

      console.log("Fetching storefront data for appearance...");
      const { data, error } = await supabase
        .from("storefronts")
        .select("*")
        .eq("id", currentStorefrontId)
        .single();

      if (error) {
        console.error("Error fetching storefront:", error);
        throw error;
      }

      console.log("Fetched storefront data:", data);
      return data;
    },
    enabled: !!currentStorefrontId,
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      favicon_url: null,
      logo_url: null,
      main_color: "#1A1F2C",
      secondary_color: "#D6BCFA",
      font_color: "#FFFFFF",
      verification_color: "#1A1F2C",
      instructions_color: "#1A1F2C",
    },
  });

  // Update form values when storefront data is loaded
  useEffect(() => {
    if (storefront) {
      console.log("Setting form values from storefront data:", storefront);
      form.reset({
        favicon_url: storefront.favicon_url,
        logo_url: storefront.logo_url,
        main_color: "#1A1F2C",
        secondary_color: "#D6BCFA",
        font_color: "#FFFFFF",
        verification_color: "#1A1F2C",
        instructions_color: "#1A1F2C",
      });
    }
  }, [storefront, form]);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
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
          <h1 className="text-3xl font-bold tracking-tight">Storefront Appearance</h1>
          <p className="text-muted-foreground mt-2">
            Customize how your storefront looks. Changes are saved automatically.
          </p>
        </div>

        {!storefront?.logo_url && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Please upload a logo in the Basic Information section first to use the color suggestion feature.
            </AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form className="space-y-8">
            <StorefrontAppearance form={form} />
          </form>
        </Form>
      </div>
    </DashboardLayout>
  );
};

export default Appearance;