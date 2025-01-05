interface ColorGridProps {
  colors: { color: string; label?: string }[];
  onColorClick?: (color: string) => void;
}

export function ColorGrid({ colors, onColorClick }: ColorGridProps) {
  return (
    <div className="flex flex-wrap gap-4">
      {colors.map((colorObj, index) => (
        <div key={index} className="space-y-2">
          <div
            className="w-12 h-12 rounded-lg border cursor-pointer hover:ring-2 hover:ring-offset-2"
            style={{ backgroundColor: colorObj.color }}
            onClick={() => onColorClick?.(colorObj.color)}
          />
          <p className="text-xs text-center font-mono">{colorObj.label || colorObj.color}</p>
        </div>
      ))}
    </div>
  );
}