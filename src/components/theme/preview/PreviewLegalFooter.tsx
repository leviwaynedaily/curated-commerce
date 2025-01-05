interface PreviewLegalFooterProps {
  businessName?: string;
}

export function PreviewLegalFooter({ businessName = "Business" }: PreviewLegalFooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-4 mt-8 border-t bg-background">
      <div className="container mx-auto px-4">
        <p className="text-sm text-center text-muted-foreground">
          © {currentYear} {businessName}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}