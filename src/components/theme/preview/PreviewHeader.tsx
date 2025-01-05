import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Grid2X2, Grid3X3, LayoutGrid } from "lucide-react";

interface PreviewHeaderProps {
  colors: any;
  logo_url?: string;
  name?: string;
  onGridChange: (size: 'small' | 'medium' | 'large') => void;
  onSearchChange: (query: string) => void;
  searchQuery: string;
  gridSize: 'small' | 'medium' | 'large';
}

export function PreviewHeader({
  colors,
  logo_url,
  name,
  onGridChange,
  onSearchChange,
  searchQuery,
  gridSize,
}: PreviewHeaderProps) {
  return (
    <header 
      className="sticky top-0 z-50 backdrop-blur-lg transition-all duration-300"
      style={{ 
        backgroundColor: `${colors.background.primary}80`,
        borderBottom: `1px solid ${colors.background.secondary}`
      }}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {logo_url && (
              <img 
                src={logo_url} 
                alt={name} 
                className="h-8 object-contain transition-opacity duration-300"
              />
            )}
          </div>

          <div className="flex-1 max-w-xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: colors.font.secondary }} />
              <Input
                type="search"
                placeholder="Search products..."
                className="w-full pl-10 transition-all duration-300"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                style={{ 
                  backgroundColor: `${colors.background.secondary}80`,
                  color: colors.font.primary,
                  borderColor: colors.background.secondary
                }}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onGridChange('small')}
              className={gridSize === 'small' ? 'bg-primary/10' : ''}
            >
              <Grid3X3 className="h-4 w-4" style={{ color: colors.font.primary }} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onGridChange('medium')}
              className={gridSize === 'medium' ? 'bg-primary/10' : ''}
            >
              <Grid2X2 className="h-4 w-4" style={{ color: colors.font.primary }} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onGridChange('large')}
              className={gridSize === 'large' ? 'bg-primary/10' : ''}
            >
              <LayoutGrid className="h-4 w-4" style={{ color: colors.font.primary }} />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}