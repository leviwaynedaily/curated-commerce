import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { useState } from "react"
import { useQueryClient } from "@tanstack/react-query"

import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { supabase } from "@/integrations/supabase/client"
import { productFormSchema, type ProductFormValues } from "../products/ProductFormTypes"
import { ProductFormFields } from "./ProductFormFields"

const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB for video support

interface ProductFormProps {
  storefrontId: string
  product?: {
    id: string
    name: string
    description?: string
    in_town_price: number
    shipping_price: number
    category?: string[]
    images?: string[]
    status?: string
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
      in_town_price: product?.in_town_price?.toString() ?? "",
      shipping_price: product?.shipping_price?.toString() ?? "",
      category: product?.category ?? [],
      images: product?.images ?? [],
      status: (product?.status as "active" | "inactive") ?? "active",
    },
  })

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    try {
      setIsUploading(true)
      const uploadedUrls = []

      // If we're editing a product, use its ID, otherwise create a temporary one
      const productId = product?.id || crypto.randomUUID()

      for (const file of files) {
        if (file.size > MAX_FILE_SIZE) {
          toast.error(`File ${file.name} is too large. Maximum size is 50MB.`)
          continue
        }

        // Check if file is an image or video
        if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
          toast.error(`File ${file.name} is not a supported format. Please upload images or videos only.`)
          continue
        }

        const fileExt = file.name.split('.').pop()
        const filePath = `${storefrontId}/products/${productId}/${crypto.randomUUID()}.${fileExt}`

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
      toast.success("Files uploaded successfully!")
    } catch (error) {
      console.error("Error in file upload:", error)
      toast.error("Failed to upload files. Please try again.")
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
        in_town_price: Number(values.in_town_price),
        shipping_price: Number(values.shipping_price),
        category: values.category,
        storefront_id: storefrontId,
        images: values.images || [],
        status: values.status,
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
        <ProductFormFields
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