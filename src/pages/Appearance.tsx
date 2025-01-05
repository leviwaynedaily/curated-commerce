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
  verification_button_color: z.string().default("#D946EF"),
  verification_button_text_color: z.string().default("#FFFFFF"),
  verification_text_color: z.string().default("#1A1F2C"),
  verification_checkbox_color: z.string().default("#D946EF"),
  verification_input_border_color: z.string().default("#E5E7EB"),
  product_card_background_color: z.string().default("#FFFFFF"),
  product_title_text_color: z.string().default("#1A1F2C"),
  product_description_text_color: z.string().default("#8E9196"),
  product_price_color: z.string().default("#D946EF"),
  product_category_background_color: z.string().default("#E5E7EB"),
  product_category_text_color: z.string().default("#1A1F2C"),
  storefront_background_color: z.string().default("#F1F0FB"),
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
      verification_button_color: "#D946EF",
      verification_button_text_color: "#FFFFFF",
      verification_text_color: "#1A1F2C",
      verification_checkbox_color: "#D946EF",
      verification_input_border_color: "#E5E7EB",
      product_card_background_color: "#FFFFFF",
      product_title_text_color: "#1A1F2C",
      product_description_text_color: "#8E9196",
      product_price_color: "#D946EF",
      product_category_background_color: "#E5E7EB",
      product_category_text_color: "#1A1F2C",
      storefront_background_color: "#F1F0FB",
    },
  });

  // Update form values when storefront data is loaded
  useEffect(() => {
    if (storefront) {
      console.log("Setting form values from storefront data:", storefront);
      form.reset({
        favicon_url: storefront.favicon_url,
        logo_url: storefront.logo_url,
        main_color: storefront.main_color || "#1A1F2C",
        secondary_color: storefront.secondary_color || "#D6BCFA",
        font_color: storefront.font_color || "#FFFFFF",
        verification_button_color: storefront.verification_button_color || "#D946EF",
        verification_button_text_color: storefront.verification_button_text_color || "#FFFFFF",
        verification_text_color: storefront.verification_text_color || "#1A1F2C",
        verification_checkbox_color: storefront.verification_checkbox_color || "#D946EF",
        verification_input_border_color: storefront.verification_input_border_color || "#E5E7EB",
        product_card_background_color: storefront.product_card_background_color || "#FFFFFF",
        product_title_text_color: storefront.product_title_text_color || "#1A1F2C",
        product_description_text_color: storefront.product_description_text_color || "#8E9196",
        product_price_color: storefront.product_price_color || "#D946EF",
        product_category_background_color: storefront.product_category_background_color || "#E5E7EB",
        product_category_text_color: storefront.product_category_text_color || "#1A1F2C",
        storefront_background_color: storefront.storefront_background_color || "#F1F0FB",
      });
    }
  }, [storefront, form]);

  // Add auto-save functionality
  useEffect(() => {
    const subscription = form.watch(async (values) => {
      if (storefront && currentStorefrontId) {
        console.log("Form values changed, saving to database:", values);
        
        const { error } = await supabase
          .from("storefronts")
          .update({
            main_color: values.main_color,
            secondary_color: values.secondary_color,
            font_color: values.font_color,
            verification_button_color: values.verification_button_color,
            verification_button_text_color: values.verification_button_text_color,
            verification_text_color: values.verification_text_color,
            verification_checkbox_color: values.verification_checkbox_color,
            verification_input_border_color: values.verification_input_border_color,
            product_card_background_color: values.product_card_background_color,
            product_title_text_color: values.product_title_text_color,
            product_description_text_color: values.product_description_text_color,
            product_price_color: values.product_price_color,
            product_category_background_color: values.product_category_background_color,
            product_category_text_color: values.product_category_text_color,
            storefront_background_color: values.storefront_background_color,
          })
          .eq("id", currentStorefrontId);

        if (error) {
          console.error("Error saving color changes:", error);
          toast({
            title: "Error",
            description: "Failed to save color changes",
            variant: "destructive",
          });
        } else {
          console.log("Color changes saved successfully");
          queryClient.invalidateQueries({ queryKey: ["storefront", currentStorefrontId] });
          toast({
            title: "Success",
            description: "Color changes saved",
          });
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [form.watch, storefront, currentStorefrontId, queryClient, toast]);

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
        <Alert>
          <AlertDescription>
            Please select a storefront first
          </AlertDescription>
        </Alert>
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
