import { useState, KeyboardEvent } from "react"
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

  // Default colors if not set in database
  const colors = {
    button: previewData.verification_button_color || '#D946EF',
    buttonText: previewData.verification_button_text_color || '#FFFFFF',
    text: previewData.verification_text_color || '#1A1F2C',
    checkbox: previewData.verification_checkbox_color || '#D946EF',
    inputBorder: previewData.verification_input_border_color || '#E5E7EB',
    nextText: previewData.verification_next_text_color || '#4CAF50',
    background: previewData.storefront_background_color || '#FFFFFF'
  }

  console.log("Verification colors being used:", colors);

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

  const handleKeyPress = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      handleVerification()
    }
  }

  // Don't render until we have the necessary data
  if (!previewData || !previewData.verification_type) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 z-50 backdrop-blur-md"
      style={{
        WebkitBackdropFilter: 'blur(8px)',
        backgroundColor: `${colors.background}80` // 80 adds 50% opacity
      }}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-[400px] rounded-lg shadow-xl bg-white/90 backdrop-blur-sm p-6 space-y-6">
          {previewData.verification_logo_url && (
            <img 
              src={previewData.verification_logo_url} 
              alt="Verification" 
              className="h-24 mx-auto object-contain"
            />
          )}
          
          <h2 
            className="text-xl font-semibold text-center" 
            style={{ color: colors.text }}
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
                    backgroundColor: ageConfirmed ? colors.checkbox : 'transparent',
                    borderColor: colors.checkbox 
                  }}
                />
                <label 
                  htmlFor="age-verification" 
                  className="text-sm cursor-pointer select-none"
                  style={{ color: colors.text }}
                  dangerouslySetInnerHTML={{ __html: previewData.verification_age_text || '' }}
                />
              </div>
            )}

            {showPassword && (
              <div className="space-y-2">
                <label 
                  className="text-sm font-medium block"
                  style={{ color: colors.text }}
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
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleVerification()
                    }
                  }}
                  className="w-full"
                  style={{ 
                    borderColor: colors.inputBorder,
                    color: colors.text
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
                backgroundColor: colors.button,
                color: colors.buttonText,
                border: 'none'
              }}
            >
              {previewData.enable_instructions ? "Next" : "Enter Site"}
            </Button>

            <div 
              className="text-xs text-center"
              style={{ color: colors.text }}
              dangerouslySetInnerHTML={{ __html: previewData.verification_legal_text || '' }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}