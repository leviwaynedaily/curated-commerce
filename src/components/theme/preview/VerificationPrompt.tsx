import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { PreviewData } from "@/types/preview"

interface VerificationPromptProps {
  previewData: PreviewData
  onVerify: (password?: string) => void
  colors: any
}

export function VerificationPrompt({ previewData, onVerify, colors }: VerificationPromptProps) {
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
    <div 
      className="fixed inset-0 backdrop-blur-lg flex items-center justify-center p-4 bg-opacity-50"
      style={{ backgroundColor: `${colors.background.primary}99` }}
    >
      <div 
        className="max-w-md w-full rounded-lg p-8 space-y-6 shadow-xl"
        style={{ backgroundColor: colors.background.secondary }}
      >
        {previewData.verification_logo_url && (
          <img 
            src={previewData.verification_logo_url} 
            alt="Verification" 
            className="h-32 mx-auto object-contain"
          />
        )}
        
        <h2 
          className="text-2xl font-bold text-center"
          style={{ color: colors.font.primary }}
        >
          Verification Required
        </h2>

        <div className="space-y-6">
          {showAge && (
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="age-verification"
                  checked={ageConfirmed}
                  onCheckedChange={(checked) => {
                    setAgeConfirmed(checked as boolean)
                    setError(null)
                  }}
                  className="h-5 w-5 rounded-sm border cursor-pointer"
                  style={{
                    borderColor: colors.background.accent,
                    backgroundColor: ageConfirmed ? colors.background.accent : 'transparent',
                  }}
                />
                <label 
                  htmlFor="age-verification" 
                  className="text-sm cursor-pointer select-none"
                  style={{ color: colors.font.secondary }}
                >
                  {previewData.verification_age_text}
                </label>
              </div>
            </div>
          )}

          {showPassword && (
            <div className="space-y-2">
              <label 
                className="text-sm font-medium"
                style={{ color: colors.font.primary }}
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
                  backgroundColor: colors.background.primary,
                  color: colors.font.primary,
                  borderColor: `${colors.font.secondary}33`
                }}
              />
            </div>
          )}

          {error && (
            <p 
              className="text-destructive text-sm"
              style={{ color: colors.font.highlight }}
            >
              {error}
            </p>
          )}

          <Button 
            className="w-full"
            style={{
              backgroundColor: colors.background.accent,
              color: colors.font.primary
            }}
            onClick={handleVerification}
          >
            {previewData.enable_instructions ? "Next" : "Enter Site"}
          </Button>

          <p 
            className="text-sm text-center"
            style={{ color: colors.font.secondary }}
          >
            {previewData.verification_legal_text}
          </p>
        </div>
      </div>
    </div>
  )
}