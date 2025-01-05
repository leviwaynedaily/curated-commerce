import { useSearchParams } from "react-router-dom";
import { LivePreview } from "@/components/theme/LivePreview";

const Preview = () => {
  const [searchParams] = useSearchParams();
  const storefrontId = searchParams.get("storefrontId") || localStorage.getItem('lastStorefrontId');

  if (!storefrontId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">No Storefront Selected</h1>
          <p className="text-muted-foreground">Please select a storefront first</p>
        </div>
      </div>
    );
  }

  return <LivePreview storefrontId={storefrontId} />;
};

export default Preview;