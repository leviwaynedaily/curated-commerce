import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form } from "@/components/ui/form";
import { StorefrontAppearance } from "@/components/storefront/StorefrontAppearance";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useMemo } from "react";
import debounce from "lodash.debounce";
import { ThemeConfig } from "@/types/theme";

const formSchema = z.object({
  theme_config: z.object({
    colors: z.object({
      background: z.object({
        primary: z.string(),
        secondary: z.string(),
        accent: z.string(),
      }),
      font: z.object({
        primary: z.string(),
        secondary: z.string(),
        highlight: z.string(),
      }),
    }),
  }).default({
    colors: {
      background: {
        primary: "#000000",
        secondary: "#f5f5f5",
        accent: "#56b533",
      },
      font: {
        primary: "#ffffff",
        secondary: "#cccccc",
        highlight: "#ee459a",
      },
    },
  }),
});

type FormValues = z.infer<typeof formSchema>;

const Appearance = () => {
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
        .select("theme_config")
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
      theme_config: (storefront?.theme_config as ThemeConfig) || {
        colors: {
          background: {
            primary: "#000000",
            secondary: "#f5f5f5",
            accent: "#56b533",
          },
          font: {
            primary: "#ffffff",
            secondary: "#cccccc",
            highlight: "#ee459a",
          },
        },
      },
    },
  });

  // Add auto-save functionality
  const debouncedSave = useMemo(
    () =>
      debounce((values: FormValues) => {
        onSubmit(values);
      }, 1000),
    []
  );

  useEffect(() => {
    const subscription = form.watch((values) => {
      debouncedSave(values as FormValues);
    });
    return () => subscription.unsubscribe();
  }, [form.watch, debouncedSave]);

  const onSubmit = async (values: FormValues) => {
    try {
      if (!currentStorefrontId) {
        throw new Error("No storefront selected");
      }

      const { error } = await supabase
        .from("storefronts")
        .update({
          theme_config: values.theme_config,
        })
        .eq("id", currentStorefrontId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Changes saved automatically",
      });
    } catch (error) {
      console.error("Error updating storefront:", error);
      toast({
        title: "Error",
        description: "Failed to save changes",
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
          <h1 className="text-3xl font-bold tracking-tight">Storefront Appearance</h1>
          <p className="text-muted-foreground mt-2">
            Customize how your storefront looks. Changes are saved automatically.
          </p>
        </div>

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