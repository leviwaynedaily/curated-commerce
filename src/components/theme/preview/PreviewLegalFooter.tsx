interface PreviewLegalFooterProps {
  colors: any;
  businessName?: string;
}

export function PreviewLegalFooter({ colors, businessName = "Business" }: PreviewLegalFooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer 
      className="py-4 mt-8 border-t"
      style={{ 
        borderColor: `${colors.font.secondary}20`,
        backgroundColor: colors.background.primary 
      }}
    >
      <div className="container mx-auto px-4">
        <p 
          className="text-sm text-center"
          style={{ color: colors.font.secondary }}
        >
          © {currentYear} {businessName}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}