import { useSearchParams } from "react-router-dom";
import { LivePreview } from "@/components/theme/LivePreview";

const Preview = () => {
  const [searchParams] = useSearchParams();
  const storefrontId = searchParams.get("storefrontId");

  if (!storefrontId) {
    return <div>No storefront ID provided</div>;
  }

  return <LivePreview storefrontId={storefrontId} />;
};

export default Preview;