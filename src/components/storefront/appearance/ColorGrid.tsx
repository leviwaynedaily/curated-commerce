interface ColorGridProps {
  colors: { color: string; label?: string; field?: string }[];
  onColorClick?: (color: string, field?: string) => void;
}

export function ColorGrid({ colors, onColorClick }: ColorGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
      {colors.map((colorObj, index) => (
        <div key={index} className="flex flex-col items-center space-y-2">
          <div
            className="w-16 h-16 rounded-lg border cursor-pointer hover:ring-2 hover:ring-offset-2 transition-all"
            style={{ backgroundColor: colorObj.color }}
            onClick={() => onColorClick?.(colorObj.color, colorObj.field)}
          />
          <p className="text-[11px] text-center font-mono truncate max-w-[90%]">
            {colorObj.label || colorObj.color}
          </p>
        </div>
      ))}
    </div>
  );
}