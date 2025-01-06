interface PreviewErrorProps {
  error: string;
}

export function PreviewError({ error }: PreviewErrorProps) {
  return (
    <div className="flex items-center justify-center h-screen bg-background">
      <div className="text-center space-y-4 p-4">
        <h2 className="text-2xl font-semibold text-foreground">{error}</h2>
        <p className="text-muted-foreground">
          Please check the URL or contact the store owner.
        </p>
      </div>
    </div>
  );
}