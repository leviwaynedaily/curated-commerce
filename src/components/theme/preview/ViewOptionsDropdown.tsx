import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"

interface ViewOptionsDropdownProps {
  layout: string
  textPlacement: string
  mainColor: string
  onLayoutChange: (value: string) => void
  onTextPlacementChange: (value: string) => void
}

export function ViewOptionsDropdown({
  layout,
  textPlacement,
  mainColor,
  onLayoutChange,
  onTextPlacementChange,
}: ViewOptionsDropdownProps) {
  return (
    <Select
      value={layout}
      onValueChange={(value) => {
        if (value.startsWith("text-")) {
          onTextPlacementChange(value.replace("text-", ""));
        } else {
          onLayoutChange(value);
        }
      }}
    >
      <SelectTrigger className="w-full h-10 text-sm bg-white/80 backdrop-blur-sm">
        View
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="list">List View</SelectItem>
        <SelectItem value="small">Small Grid</SelectItem>
        <SelectItem value="medium">Medium Grid</SelectItem>
        <SelectItem value="large">Large Grid</SelectItem>
        <SelectItem value="text-overlay">Text Overlay</SelectItem>
        <SelectItem value="text-below">Text Below</SelectItem>
      </SelectContent>
    </Select>
  )
}