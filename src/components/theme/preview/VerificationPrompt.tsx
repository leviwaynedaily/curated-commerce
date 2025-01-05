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

  console.log("Verification colors from database:", {
    buttonColor: previewData.verification_button_color,
    buttonTextColor: previewData.verification_button_text_color,
    textColor: previewData.verification_text_color,
    checkboxColor: previewData.verification_checkbox_color,
    inputBorderColor: previewData.verification_input_border_color
  });

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
      <div className="w-[400px] rounded-lg shadow-xl bg-white p-6 space-y-6">
        {previewData.verification_logo_url && (
          <img 
            src={previewData.verification_logo_url} 
            alt="Verification" 
            className="h-24 mx-auto object-contain" // Increased from h-16 to h-24
          />
        )}
        
        <h2 
          className="text-xl font-semibold text-center" 
          style={{ color: previewData.verification_text_color }}
        >
          Verification Required
        </h2>

        <div className="space-y-4">
          {showAge && (
            <div className="flex items-start space-x-3">
              <Checkbox
                id="age-verification"
                checked={ageConfirmed}
                onCheckedChange={(checked) => {
                  setAgeConfirmed(checked as boolean)
                  setError(null)
                }}
                className="mt-1"
                style={{ 
                  backgroundColor: ageConfirmed ? previewData.verification_checkbox_color : 'transparent',
                  borderColor: previewData.verification_checkbox_color 
                }}
              />
              <label 
                htmlFor="age-verification" 
                className="text-sm cursor-pointer select-none"
                style={{ color: previewData.verification_text_color }}
                dangerouslySetInnerHTML={{ __html: previewData.verification_age_text || '' }}
              />
            </div>
          )}

          {showPassword && (
            <div className="space-y-2">
              <label 
                className="text-sm font-medium block"
                style={{ color: previewData.verification_text_color }}
              >
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
                className="w-full"
                style={{ 
                  borderColor: previewData.verification_input_border_color,
                  color: previewData.verification_text_color
                }}
              />
            </div>
          )}

          {error && (
            <p className="text-destructive text-sm">
              {error}
            </p>
          )}

          <Button 
            className="w-full"
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
            className="text-xs text-center"
            style={{ color: previewData.verification_text_color }}
            dangerouslySetInnerHTML={{ __html: previewData.verification_legal_text || '' }}
          />
        </div>
      </div>
    </div>
  )
}