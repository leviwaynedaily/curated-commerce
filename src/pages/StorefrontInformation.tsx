import { DashboardLayout } from "@/components/layout/DashboardLayout";

const StorefrontInformation = () => {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Storefront Information</h1>
          <p className="text-muted-foreground mt-2">
            Customize how your storefront appears to customers.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StorefrontInformation;