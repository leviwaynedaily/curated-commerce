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
      <div className="flex items-center gap-4">
        <div
          className="w-12 h-12 rounded-lg border"
          style={{ backgroundColor: selectedColor }}
        />
        <div className="flex-1">
          <div className="flex gap-2">
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
          <p className="text-xs font-mono mt-1">{selectedColor}</p>
        </div>
      </div>
    </div>
  );
}