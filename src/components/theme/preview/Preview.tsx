import { LivePreview } from "../LivePreview";

interface PreviewProps {
  storefrontId: string;
}

export function Preview({ storefrontId }: PreviewProps) {
  console.log("Preview component rendering with ID:", storefrontId);
  return (
    <div className="w-full h-screen overflow-hidden">
      <LivePreview storefrontId={storefrontId} />
    </div>
  );
}