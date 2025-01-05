import { useSearchParams } from "react-router-dom";
import { LivePreview } from "@/components/theme/LivePreview";

export default function Preview() {
  const [searchParams] = useSearchParams();
  const storefrontId = searchParams.get('storefrontId');

  if (!storefrontId) {
    return (
      <div className="flex items-center justify-center h-screen p-4 text-muted-foreground">
        No storefront ID provided
      </div>
    );
  }

  return (
    <div className="w-full h-screen overflow-hidden">
      <LivePreview storefrontId={storefrontId} />
    </div>
  );
}