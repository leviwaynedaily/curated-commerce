import { PreviewData } from "@/types/preview";

interface PreviewContentProps {
  previewData: PreviewData;
  colors: any;
}

export function PreviewContent({ previewData, colors }: PreviewContentProps) {
  return (
    <div>
      <header
        className="p-6 border-b"
        style={{ 
          backgroundColor: colors.background.secondary,
          borderColor: `${colors.background.accent}22`
        }}
      >
        {previewData.logo_url && (
          <img 
            src={previewData.logo_url} 
            alt={previewData.name} 
            className="h-16 object-contain mb-4"
          />
        )}
        <h1 
          className="text-2xl font-bold"
          style={{ 
            color: colors.font.primary,
            background: colors.font.highlight.includes('gradient') 
              ? colors.font.highlight 
              : 'none',
            WebkitBackgroundClip: colors.font.highlight.includes('gradient') ? 'text' : 'none',
            WebkitTextFillColor: colors.font.highlight.includes('gradient') ? 'transparent' : colors.font.primary,
          }}
        >
          {previewData.name}
        </h1>
        {previewData.description && (
          <p 
            className="mt-2"
            style={{ color: colors.font.secondary }}
          >
            {previewData.description}
          </p>
        )}
      </header>

      <main className="p-6">
        <div 
          className="text-center"
          style={{ color: colors.font.primary }}
        >
          Live Preview Mode
        </div>
      </main>
    </div>
  );
}