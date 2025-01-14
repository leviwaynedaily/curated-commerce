import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { StorefrontBasicInfo } from "@/components/storefront/StorefrontBasicInfo";
import { StorefrontVerification } from "@/components/storefront/StorefrontVerification";
import { StorefrontInstructions } from "@/components/storefront/StorefrontInstructions";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useMemo } from "react";
import debounce from "lodash.debounce";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(1, "Site name is required"),
  logo_url: z.string().nullable(),
  favicon_url: z.string().nullable(),
  description: z.string().nullable().optional(),
  show_description: z.boolean().default(false),
  verification_type: z.enum(["none", "age", "password", "both"]).default("none"),
  verification_logo_url: z.string().nullable(),
  verification_age: z.number().default(21),
  verification_age_text: z.string().nullable(),
  verification_password: z.string().nullable(),
  verification_legal_text: z.string().nullable(),
  enable_instructions: z.boolean().default(false),
  instructions_text: z.string().nullable(),
  show_verification_options: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

const DEFAULT_VALUES: FormValues = {
  name: "",
  logo_url: null,
  favicon_url: null,
  description: "",
  show_description: false,
  verification_type: "none" as const,
  verification_logo_url: null,
  verification_age: 21,
  verification_age_text: "I confirm that I am 21 years of age or older and agree to the Terms of Service and Privacy Policy.",
  verification_password: null,
  verification_legal_text: "This website contains age-restricted content. By entering, you accept our terms and confirm your legal age to view such content.",
  enable_instructions: false,
  instructions_text: null,
  show_verification_options: false,
};

const StorefrontInformation = () => {
  const { toast } = useToast();
  const currentStorefrontId = localStorage.getItem('lastStorefrontId');

  const { data: storefront, isLoading, error } = useQuery({
    queryKey: ["storefront", currentStorefrontId],
    queryFn: async () => {
      console.log("Fetching storefront with ID:", currentStorefrontId);
      
      if (!currentStorefrontId) {
        throw new Error("No storefront selected");
      }

      const { data: session } = await supabase.auth.getSession();
      console.log("Current session:", session?.session?.user?.id);

      const { data, error } = await supabase
        .from("storefronts")
        .select("*, businesses!inner(*)")
        .eq("id", currentStorefrontId)
        .maybeSingle();

      if (error) {
        console.error("Error fetching storefront:", error);
        throw error;
      }

      if (!data) {
        console.error("No storefront found with ID:", currentStorefrontId);
        throw new Error("Storefront not found");
      }

      console.log("Fetched storefront data:", data);
      return data;
    },
    enabled: !!currentStorefrontId,
    staleTime: 0,
    retry: 1,
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: DEFAULT_VALUES,
  });

  // Update form values when storefront data is loaded
  useEffect(() => {
    if (storefront) {
      console.log("Setting form values from storefront data:", storefront);
      form.reset({
        name: storefront.name || DEFAULT_VALUES.name,
        logo_url: storefront.logo_url || DEFAULT_VALUES.logo_url,
        favicon_url: storefront.favicon_url || DEFAULT_VALUES.favicon_url,
        description: storefront.description || DEFAULT_VALUES.description,
        show_description: storefront.show_description || DEFAULT_VALUES.show_description,
        verification_type: (storefront.verification_type as FormValues['verification_type']) || DEFAULT_VALUES.verification_type,
        verification_logo_url: storefront.verification_logo_url || DEFAULT_VALUES.verification_logo_url,
        verification_age: storefront.verification_age || DEFAULT_VALUES.verification_age,
        verification_age_text: storefront.verification_age_text || DEFAULT_VALUES.verification_age_text,
        verification_password: storefront.verification_password || DEFAULT_VALUES.verification_password,
        verification_legal_text: storefront.verification_legal_text || DEFAULT_VALUES.verification_legal_text,
        enable_instructions: storefront.enable_instructions || DEFAULT_VALUES.enable_instructions,
        instructions_text: storefront.instructions_text || DEFAULT_VALUES.instructions_text,
        show_verification_options: false,
      });
    }
  }, [storefront, form]);

  const onSubmit = async (values: FormValues) => {
    try {
      console.log("Attempting to save storefront with values:", values);
      
      if (!currentStorefrontId) {
        console.error("No storefront ID found");
        throw new Error("No storefront selected");
      }

      const { data: session } = await supabase.auth.getSession();
      console.log("Current session during save:", session?.session?.user?.id);

      const { error } = await supabase
        .from("storefronts")
        .update({
          name: values.name,
          logo_url: values.logo_url,
          favicon_url: values.favicon_url,
          description: values.description || null,
          show_description: values.show_description,
          verification_type: values.verification_type,
          verification_logo_url: values.verification_logo_url,
          verification_age: values.verification_age,
          verification_age_text: values.verification_age_text,
          verification_password: values.verification_password,
          verification_legal_text: values.verification_legal_text,
          enable_instructions: values.enable_instructions,
          instructions_text: values.instructions_text,
        })
        .eq("id", currentStorefrontId);

      if (error) {
        console.error("Error updating storefront:", error);
        throw error;
      }

      console.log("Storefront updated successfully");
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

  // Add auto-save functionality with debounce
  const debouncedSave = useMemo(
    () =>
      debounce(async (values: FormValues) => {
        console.log("Auto-saving form values:", values);
        await onSubmit(values);
      }, 1000),
    []
  );

  // Watch for form changes and trigger auto-save
  useEffect(() => {
    const subscription = form.watch((values) => {
      if (storefront) {
        console.log("Form values changed:", values);
        debouncedSave(values as FormValues);
      }
    });
    return () => subscription.unsubscribe();
  }, [form.watch, debouncedSave, storefront]);

  // Update favicon when it changes
  useEffect(() => {
    const faviconUrl = form.watch("favicon_url");
    console.log("Favicon URL changed:", faviconUrl);
    
    if (faviconUrl) {
      const favicon = document.querySelector("link[rel='icon']") as HTMLLinkElement;
      if (!favicon) {
        const newFavicon = document.createElement('link');
        newFavicon.rel = 'icon';
        newFavicon.href = faviconUrl;
        document.head.appendChild(newFavicon);
      } else {
        favicon.href = faviconUrl;
      }
    }
  }, [form.watch("favicon_url")]);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <Alert variant="destructive">
          <AlertDescription>
            Failed to load storefront information. Please try refreshing the page.
          </AlertDescription>
        </Alert>
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
        <p className="text-white mt-2">
          Customize how your storefront appears to customers. Changes are saved automatically.
        </p>

        <Form {...form}>
          <form className="space-y-8">
            <StorefrontBasicInfo form={form} />
            
            <Separator className="my-8" />
            
            <StorefrontVerification form={form} />
            
            <Separator className="my-8" />
            
            <StorefrontInstructions form={form} />
          </form>
        </Form>
      </div>
    </DashboardLayout>
  );
};

export default StorefrontInformation;
