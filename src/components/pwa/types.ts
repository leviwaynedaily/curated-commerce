import { z } from "zod";

export const pwaFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  short_name: z.string().min(2, "Short name must be at least 2 characters"),
  description: z.string().optional(),
  start_url: z.string().default("/"),
  display: z.enum(["standalone", "fullscreen", "minimal-ui", "browser"]).default("standalone"),
  orientation: z.enum(["portrait", "landscape", "any"]).default("any"),
  theme_color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Must be a valid hex color"),
  background_color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Must be a valid hex color"),
  icon_72x72: z.string().optional(),
  icon_96x96: z.string().optional(),
  icon_128x128: z.string().optional(),
  icon_144x144: z.string().optional(),
  icon_152x152: z.string().optional(),
  icon_192x192: z.string().min(1, "A 192x192 icon is required for PWA"),
  icon_384x384: z.string().optional(),
  icon_512x512: z.string().min(1, "A 512x512 icon is required for PWA"),
  screenshot_mobile: z.string().optional(),
  screenshot_desktop: z.string().optional(),
});

export type PWAFormValues = z.infer<typeof pwaFormSchema>;