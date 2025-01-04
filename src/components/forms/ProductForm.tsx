import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { useState } from "react"
import { useQueryClient } from "@tanstack/react-query"

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
import { ProductImageUpload } from "../products/ProductImageUpload"
import { productFormSchema, type ProductFormValues } from "../products/ProductFormTypes"

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

interface ProductFormProps {
  storefrontId: string
  product?: {
    id: string
    name: string
    description?: string
    price: number
    category?: string
    images?: string[]
  }
  onSuccess?: () => void
}

export function ProductForm({ storefrontId, product, onSuccess }: ProductFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const queryClient = useQueryClient()

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: product?.name ?? "",
      description: product?.description ?? "",
      price: product?.price?.toString() ?? "",
      category: product?.category ?? "",
      images: product?.images ?? [],
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

  async function onSubmit(values: ProductFormValues) {
    try {
      setIsLoading(true)
      console.log("Submitting product form with values:", values)

      const productData = {
        name: values.name,
        description: values.description || null,
        price: Number(values.price),
        category: values.category || null,
        storefront_id: storefrontId,
        images: values.images || [],
      }

      const { error } = product
        ? await supabase
            .from("products")
            .update(productData)
            .eq("id", product.id)
        : await supabase
            .from("products")
            .insert(productData)
            .select()
            .single()

      if (error) throw error

      console.log(`Product ${product ? 'updated' : 'created'} successfully`)
      toast.success(`Product ${product ? 'updated' : 'created'} successfully!`)
      form.reset()
      queryClient.invalidateQueries({ queryKey: ["products"] })
      onSuccess?.()
    } catch (error) {
      console.error(`Error ${product ? 'updating' : 'creating'} product:`, error)
      toast.error(`Failed to ${product ? 'update' : 'create'} product. Please try again.`)
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
        <ProductImageUpload
          form={form}
          isUploading={isUploading}
          onUpload={handleImageUpload}
        />
        <Button type="submit" disabled={isLoading || isUploading}>
          {isLoading ? `${product ? 'Updating' : 'Creating'}...` : product ? 'Update Product' : 'Create Product'}
        </Button>
      </form>
    </Form>
  )
}