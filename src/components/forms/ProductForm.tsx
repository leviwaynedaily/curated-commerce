"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { toast } from "sonner"
import { useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { ImagePlus, Loader2 } from "lucide-react"

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
import { Textarea } from "@/components/ui/textarea"
import { supabase } from "@/integrations/supabase/client"

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Product name must be at least 2 characters.",
  }),
  description: z.string().optional(),
  price: z.string().refine((val) => !isNaN(Number(val)), {
    message: "Price must be a valid number",
  }),
  category: z.string().optional(),
  images: z.array(z.string()).optional(),
})

export function ProductForm({ storefrontId }: { storefrontId: string }) {
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const queryClient = useQueryClient()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      price: "",
      category: "",
      images: [],
    },
  })

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    try {
      setIsUploading(true)
      const uploadedUrls = []

      for (const file of files) {
        if (file.size > MAX_FILE_SIZE) {
          toast.error(`File ${file.name} is too large. Maximum size is 5MB.`)
          continue
        }

        const fileExt = file.name.split('.').pop()
        const filePath = `${storefrontId}/${crypto.randomUUID()}.${fileExt}`

        console.log("Uploading file:", filePath)
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('storefront-assets')
          .upload(filePath, file)

        if (uploadError) {
          console.error("Error uploading file:", uploadError)
          toast.error(`Failed to upload ${file.name}`)
          continue
        }

        console.log("File uploaded successfully:", uploadData)
        const { data: { publicUrl } } = supabase.storage
          .from('storefront-assets')
          .getPublicUrl(filePath)

        uploadedUrls.push(publicUrl)
      }

      const currentImages = form.getValues("images") || []
      form.setValue("images", [...currentImages, ...uploadedUrls])
      toast.success("Images uploaded successfully!")
    } catch (error) {
      console.error("Error in image upload:", error)
      toast.error("Failed to upload images. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true)
      console.log("Submitting product form with values:", values)

      const { data, error } = await supabase
        .from("products")
        .insert({
          name: values.name,
          description: values.description || null,
          price: Number(values.price),
          category: values.category || null,
          storefront_id: storefrontId,
          images: values.images || [],
        })
        .select()
        .single()

      if (error) throw error

      console.log("Product created successfully:", data)
      toast.success("Product created successfully!")
      form.reset()
      queryClient.invalidateQueries({ queryKey: ["products"] })
    } catch (error) {
      console.error("Error creating product:", error)
      toast.error("Failed to create product. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Product name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Product description"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" placeholder="0.00" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <Input placeholder="Product category" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="images"
          render={() => (
            <FormItem>
              <FormLabel>Images</FormLabel>
              <FormControl>
                <div className="flex items-center gap-4">
                  <Input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    disabled={isUploading}
                    className="hidden"
                    id="image-upload"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById("image-upload")?.click()}
                    disabled={isUploading}
                  >
                    {isUploading ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <ImagePlus className="h-4 w-4 mr-2" />
                    )}
                    Upload Images
                  </Button>
                </div>
              </FormControl>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                {form.watch("images")?.map((url, index) => (
                  <img
                    key={index}
                    src={url}
                    alt={`Product image ${index + 1}`}
                    className="w-full h-32 object-cover rounded-md"
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading || isUploading}>
          {isLoading ? "Creating..." : "Create Product"}
        </Button>
      </form>
    </Form>
  )
}