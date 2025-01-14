import React from 'react';
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { StorefrontAppearance } from "@/components/storefront/StorefrontAppearance"
import { useForm } from "react-hook-form"
import { useStorefront } from "@/hooks/useStorefront"

export default function Appearance() {
  const currentStorefrontId = localStorage.getItem('lastStorefrontId');
  const { data: storefront } = useStorefront(currentStorefrontId);
  
  const form = useForm({
    defaultValues: {
      main_color: "#1A1F2C",
      font_color: "#FFFFFF",
      product_card_background_color: "#FFFFFF",
      product_title_text_color: "#1A1F2C",
      product_description_text_color: "#8E9196",
      product_price_color: "#D946EF",
      product_price_button_color: "#F1F0FB",
      product_category_background_color: "#E5E7EB",
      product_category_text_color: "#1A1F2C",
      storefront_background_color: "#F1F0FB",
      header_opacity: 30,
      header_color: "#FFFFFF",
    }
  });

  // Update form values when storefront data is loaded
  React.useEffect(() => {
    if (storefront) {
      form.reset({
        main_color: storefront.main_color || "#1A1F2C",
        font_color: storefront.font_color || "#FFFFFF",
        product_card_background_color: storefront.product_card_background_color || "#FFFFFF",
        product_title_text_color: storefront.product_title_text_color || "#1A1F2C",
        product_description_text_color: storefront.product_description_text_color || "#8E9196",
        product_price_color: storefront.product_price_color || "#D946EF",
        product_price_button_color: storefront.product_price_button_color || "#F1F0FB",
        product_category_background_color: storefront.product_category_background_color || "#E5E7EB",
        product_category_text_color: storefront.product_category_text_color || "#1A1F2C",
        storefront_background_color: storefront.storefront_background_color || "#F1F0FB",
        header_opacity: storefront.header_opacity || 30,
        header_color: storefront.header_color || "#FFFFFF",
      });
    }
  }, [storefront, form]);

  return (
    <DashboardLayout>
      <StorefrontAppearance form={form} />
    </DashboardLayout>
  );
}