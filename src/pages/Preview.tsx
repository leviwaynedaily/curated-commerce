import { useSearchParams } from "react-router-dom";
import { LivePreview } from "@/components/theme/LivePreview";

export default function Preview() {
  const [searchParams] = useSearchParams();
  const storefrontId = searchParams.get('storefrontId');

  if (!storefrontId) {
    return <div className="p-4">No storefront ID provided</div>;
  }

  return (
    <div className="w-full h-screen">
      <LivePreview storefrontId={storefrontId} />
    </div>
  );
}