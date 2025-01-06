import { useState, useEffect } from "react";
import { PreviewHeader } from "./preview/PreviewHeader";
import { PreviewContent } from "./preview/PreviewContent";
import { PreviewData } from "@/types/preview";
import { VerificationPrompt } from "./preview/VerificationPrompt";
import { PreviewInstructions } from "./preview/PreviewInstructions";
import { PreviewLegalFooter } from "./preview/PreviewLegalFooter";
import { useStorefront } from "@/hooks/useStorefront";

interface LivePreviewProps {
  storefrontId: string;
  previewData?: PreviewData;
  onSearchChange?: (query: string) => void;
  onSortChange?: (sort: string) => void;
  onCategoryChange?: (category: string | null) => void;
  categories?: string[];
  selectedCategory?: string | null;
  currentSort?: string;
  textPlacement?: string;
  onTextPlacementChange?: (placement: string) => void;
}

export function LivePreview({
  storefrontId,
  previewData: initialPreviewData,
  onSearchChange,
  onSortChange,
  onCategoryChange,
  categories,
  selectedCategory,
  currentSort,
  textPlacement,
  onTextPlacementChange,
}: LivePreviewProps) {
  const [isVerified, setIsVerified] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Fetch storefront data if not provided
  const { data: fetchedPreviewData, isLoading } = useStorefront(storefrontId);
  const previewData = initialPreviewData || fetchedPreviewData;

  if (isLoading || !previewData) {
    return <div>Loading...</div>;
  }

  const handleVerification = () => {
    setIsVerified(true);
    if (previewData.enable_instructions) {
      setShowInstructions(true);
    }
  };

  const handleRestartVerification = () => {
    console.log("Restarting verification process");
    setIsVerified(false);
    setShowInstructions(false);
  };

  const handleShowInstructions = () => {
    setShowInstructions(true);
  };

  const handleContinue = () => {
    setShowInstructions(false);
  };

  const shouldShowVerification = !isVerified && previewData.verification_type !== 'none';
  const shouldShowInstructions = isVerified && showInstructions && previewData.enable_instructions;

  return (
    <div 
      className="h-full w-full bg-white overflow-auto"
      style={{ backgroundColor: previewData.storefront_background_color }}
    >
      {shouldShowVerification ? (
        <VerificationPrompt previewData={previewData} onVerify={handleVerification} />
      ) : (
        <>
          <PreviewHeader
            previewData={previewData}
            searchQuery={searchQuery}
            onSearchChange={(query) => {
              setSearchQuery(query);
              onSearchChange?.(query);
            }}
            onSortChange={onSortChange}
            onCategoryChange={onCategoryChange}
            categories={categories}
            selectedCategory={selectedCategory}
            currentSort={currentSort}
            textPlacement={textPlacement}
            onTextPlacementChange={onTextPlacementChange}
            onShowInstructions={handleShowInstructions}
            onRestartVerification={handleRestartVerification}
          />
          <PreviewContent
            previewData={previewData}
            searchQuery={searchQuery}
            selectedCategory={selectedCategory}
            currentSort={currentSort}
            textPlacement={textPlacement}
          />
          <PreviewLegalFooter previewData={previewData} />
        </>
      )}
      {shouldShowInstructions && (
        <PreviewInstructions previewData={previewData} onContinue={handleContinue} />
      )}
    </div>
  );
}