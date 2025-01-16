import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useNavigate } from "react-router-dom"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"
import { TablesInsert } from "@/integrations/supabase/types"

// Use the correct types from Supabase
type BusinessInsert = TablesInsert<"businesses">;

interface BusinessFormProps {
  onSuccess?: () => void;
}

const businessSchema = z.object({
  name: z.string().min(2, "Business name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
});

export function BusinessForm({ onSuccess }: BusinessFormProps) {
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof businessSchema>>({
    resolver: zodResolver(businessSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  async function onSubmit(values: z.infer<typeof businessSchema>) {
    try {
      console.log("Creating business with values:", values);

      // First get the current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        console.error("Error getting user:", userError);
        toast.error("Failed to get user information");
        return;
      }

      if (!user) {
        console.error("No user found");
        toast.error("Please log in to create a business");
        return;
      }

      console.log("Creating business for user:", user.id);

      const { error } = await supabase.from("businesses").insert({
        ...values,
        user_id: user.id, // Make sure we set the user_id
        status: 'active'
      } as BusinessInsert);

      if (error) {
        console.error("Error creating business:", error);
        throw error;
      }

      console.log("Business created successfully");
      toast.success("Business created successfully!");
      
      if (onSuccess) {
        onSuccess();
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Error creating business:", error);
      toast.error("Failed to create business. Please try again.");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Business Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter your business name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Business Email</FormLabel>
              <FormControl>
                <Input placeholder="Enter your business email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Business Phone (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="Enter your business phone" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Create Business
        </Button>
      </form>
    </Form>
  );
}