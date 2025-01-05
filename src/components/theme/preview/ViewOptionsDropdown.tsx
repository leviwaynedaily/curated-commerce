import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LayoutGrid, Settings2 } from "lucide-react"

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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          className="bg-white/80 hover:bg-white/90"
        >
          <Settings2 className="h-5 w-5" style={{ color: mainColor }} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-white/95 backdrop-blur-sm">
        <DropdownMenuLabel>View Options</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">Layout</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={layout} onValueChange={onLayoutChange}>
          <DropdownMenuRadioItem value="list">List View</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="small">Small Grid</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="medium">Medium Grid</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="large">Large Grid</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">Text Placement</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={textPlacement} onValueChange={onTextPlacementChange}>
          <DropdownMenuRadioItem value="overlay">Text Overlay</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="below">Text Below</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}