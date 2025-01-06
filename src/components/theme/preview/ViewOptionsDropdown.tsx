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
import { Settings2 } from "lucide-react"

interface ViewOptionsDropdownProps {
  textPlacement: string
  mainColor: string
  onTextPlacementChange: (value: string) => void
}

export function ViewOptionsDropdown({
  textPlacement,
  mainColor,
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
        <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">Text Placement</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={textPlacement} onValueChange={onTextPlacementChange}>
          <DropdownMenuRadioItem value="overlay">Text Overlay</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="below">Text Below</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}