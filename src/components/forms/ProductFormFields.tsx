import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { UseFormReturn } from "react-hook-form"
import { ProductFormValues } from "../products/ProductFormTypes"
import { ProductImageUpload } from "../products/ProductImageUpload"

interface ProductFormFieldsProps {
  form: UseFormReturn<ProductFormValues>
  isUploading: boolean
  onUpload: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>
}

export function ProductFormFields({ form, isUploading, onUpload }: ProductFormFieldsProps) {
  return (
    <>
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
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          control={form.control}
          name="in_town_price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>In-Town Price</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" placeholder="0.00" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="shipping_price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Shipping Price</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" placeholder="0.00" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
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
        onUpload={onUpload}
      />
    </>
  )
}