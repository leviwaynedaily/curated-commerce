import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { PreviewData } from "@/types/preview"

interface VerificationPromptProps {
  previewData: PreviewData
  onVerify: (password?: string) => void
}

export function VerificationPrompt({ previewData, onVerify }: VerificationPromptProps) {
  const [password, setPassword] = useState("")
  const [ageConfirmed, setAgeConfirmed] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const showBothPrompts = previewData.verification_type === 'both'
  const showPassword = previewData.verification_type === 'password' || showBothPrompts
  const showAge = previewData.verification_type === 'age' || showBothPrompts

  const handleVerification = () => {
    if (showAge && !ageConfirmed) {
      setError("Please confirm your age")
      return
    }
    
    if (showPassword && password !== previewData.verification_password) {
      setError("Incorrect password")
      return
    }

    onVerify(password)
  }

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div 
        className="w-[90%] rounded-lg p-4 space-y-4 shadow-xl bg-card"
        style={{ color: previewData.verification_text_color }}
      >
        {previewData.verification_logo_url && (
          <img 
            src={previewData.verification_logo_url} 
            alt="Verification" 
            className="h-16 mx-auto object-contain"
          />
        )}
        
        <h2 className="text-lg font-bold text-center">
          Verification Required
        </h2>

        <div className="space-y-4">
          {showAge && (
            <div className="flex items-start space-x-2">
              <Checkbox
                id="age-verification"
                checked={ageConfirmed}
                onCheckedChange={(checked) => {
                  setAgeConfirmed(checked as boolean)
                  setError(null)
                }}
                className="mt-1 h-4 w-4 rounded-sm border cursor-pointer"
                style={{ 
                  backgroundColor: ageConfirmed ? previewData.verification_checkbox_color : 'transparent',
                  borderColor: previewData.verification_checkbox_color 
                }}
              />
              <label 
                htmlFor="age-verification" 
                className="text-xs cursor-pointer select-none prose prose-sm [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-5 [&_ol]:pl-5 [&_li]:text-inherit"
                dangerouslySetInnerHTML={{ __html: previewData.verification_age_text || '' }}
              />
            </div>
          )}

          {showPassword && (
            <div className="space-y-1">
              <label className="text-xs font-medium">
                Site Password
              </label>
              <Input
                type="password"
                placeholder="Enter site password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setError(null)
                }}
                className="w-full h-8 text-sm"
                style={{ 
                  borderColor: previewData.verification_input_border_color 
                }}
              />
            </div>
          )}

          {error && (
            <p className="text-destructive text-xs">
              {error}
            </p>
          )}

          <Button 
            className="w-full h-8 text-sm"
            onClick={handleVerification}
            style={{ 
              backgroundColor: previewData.verification_button_color,
              color: previewData.verification_button_text_color,
              border: 'none'
            }}
          >
            {previewData.enable_instructions ? "Next" : "Enter Site"}
          </Button>

          <div 
            className="text-[10px] text-center prose prose-sm [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-5 [&_ol]:pl-5 [&_li]:text-inherit"
            dangerouslySetInnerHTML={{ __html: previewData.verification_legal_text || '' }}
          />
        </div>
      </div>
    </div>
  );
}