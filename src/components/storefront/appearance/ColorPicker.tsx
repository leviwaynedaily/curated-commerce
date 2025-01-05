import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface ColorPickerProps {
  colors: string[];
  selectedColor: string;
  onColorSelect: (color: string) => void;
  label?: string;
}

export function ColorPicker({ colors, selectedColor, onColorSelect, label }: ColorPickerProps) {
  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}
      <div className="flex gap-2">
        <div className="flex gap-2 flex-wrap">
          {colors.map((color, index) => (
            <button
              key={index}
              className={`w-8 h-8 rounded-full border-2 ${
                selectedColor === color ? 'border-gray-900' : 'border-transparent'
              }`}
              style={{ backgroundColor: color }}
              onClick={() => onColorSelect(color)}
              type="button"
            />
          ))}
        </div>
        <Input
          type="color"
          value={selectedColor}
          onChange={(e) => onColorSelect(e.target.value)}
          className="w-12 h-12 p-1 rounded-lg"
        />
        <Input
          type="text"
          value={selectedColor}
          onChange={(e) => onColorSelect(e.target.value)}
          className="flex-1"
        />
      </div>
    </div>
  );
}