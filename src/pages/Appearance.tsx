import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form } from "@/components/ui/form";
import { StorefrontAppearance } from "@/components/storefront/StorefrontAppearance";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

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
  const currentStorefrontId = localStorage.getItem('lastStorefrontId');

  const { data: storefront, isLoading, refetch } = useQuery({
    queryKey: ["storefront", currentStorefrontId],
    queryFn: async () => {
      if (!currentStorefrontId) {
        throw new Error("No storefront selected");
      }

      const { data, error } = await supabase
        .from("storefronts")
        .select("*")
        .eq("id", currentStorefrontId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!currentStorefrontId
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