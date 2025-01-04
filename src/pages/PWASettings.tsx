import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PWASettingsForm } from "@/components/pwa/PWASettingsForm";

const PWASettings = () => {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">PWA Settings</h1>
          <p className="text-muted-foreground mt-2">
            Configure your Progressive Web App settings for mobile and desktop devices.
          </p>
        </div>
        <PWASettingsForm />
      </div>
    </DashboardLayout>
  );
};

export default PWASettings;