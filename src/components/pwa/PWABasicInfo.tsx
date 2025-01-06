import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PWABasicInfoProps {
  form: UseFormReturn<any>;
}

export function PWABasicInfo({ form }: PWABasicInfoProps) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold">Basic Information</h2>
        <p className="text-sm text-muted-foreground">
          Configure the basic details of your Progressive Web App
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormDescription>
                The full name of your app as it appears on the user's device
              </FormDescription>
              <FormControl>
                <Input placeholder="My Awesome Store" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="short_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Short Name</FormLabel>
              <FormDescription>
                A shorter name used when space is limited (e.g., under the app icon)
              </FormDescription>
              <FormControl>
                <Input placeholder="My Store" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>Description</FormLabel>
              <FormDescription>
                A detailed description of your app that appears in app stores and search results
              </FormDescription>
              <FormControl>
                <Textarea
                  placeholder="Your store's complete description that will appear in app stores and search results"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="start_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Start URL</FormLabel>
              <FormDescription>
                The page that opens when users launch your app (usually "/" for homepage)
              </FormDescription>
              <FormControl>
                <Input placeholder="/" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="display"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Display Mode</FormLabel>
              <FormDescription>
                How your app appears on the user's device when launched
              </FormDescription>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select display mode" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="standalone">Standalone (Recommended)</SelectItem>
                  <SelectItem value="fullscreen">Fullscreen</SelectItem>
                  <SelectItem value="minimal-ui">Minimal UI</SelectItem>
                  <SelectItem value="browser">Browser</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="orientation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Orientation</FormLabel>
              <FormDescription>
                The preferred screen orientation for your app
              </FormDescription>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select orientation" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="any">Any (Recommended)</SelectItem>
                  <SelectItem value="portrait">Portrait</SelectItem>
                  <SelectItem value="landscape">Landscape</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="theme_color"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Theme Color</FormLabel>
              <FormDescription>
                The color of the browser UI elements (e.g., address bar) when your app is open
              </FormDescription>
              <FormControl>
                <Input type="color" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="background_color"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Background Color</FormLabel>
              <FormDescription>
                The background color shown while your app is loading
              </FormDescription>
              <FormControl>
                <Input type="color" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}