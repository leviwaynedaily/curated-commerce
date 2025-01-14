import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { StorefrontBasicInfo } from "@/components/storefront/StorefrontBasicInfo"
import { StorefrontInstructions } from "@/components/storefront/StorefrontInstructions"
import { StorefrontVerification } from "@/components/storefront/StorefrontVerification"

export default function StorefrontInformation() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <StorefrontBasicInfo />
        <StorefrontInstructions />
        <StorefrontVerification />
      </div>
    </DashboardLayout>
  )
}