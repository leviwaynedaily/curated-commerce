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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="relative max-w-md w-full rounded-lg p-8 space-y-6 shadow-xl bg-card">
        {previewData.verification_logo_url && (
          <img 
            src={previewData.verification_logo_url} 
            alt="Verification" 
            className="h-32 mx-auto object-contain"
          />
        )}
        
        <h2 className="text-2xl font-bold text-center">
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
                />
                <label 
                  htmlFor="age-verification" 
                  className="text-sm cursor-pointer select-none prose prose-sm [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-5 [&_ol]:pl-5 [&_li]:text-inherit"
                  dangerouslySetInnerHTML={{ __html: previewData.verification_age_text || '' }}
                />
              </div>
            </div>
          )}

          {showPassword && (
            <div className="space-y-2">
              <label className="text-sm font-medium">
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
          >
            {previewData.enable_instructions ? "Next" : "Enter Site"}
          </Button>

          <div 
            className="text-sm text-center prose prose-sm [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-5 [&_ol]:pl-5 [&_li]:text-inherit"
            dangerouslySetInnerHTML={{ __html: previewData.verification_legal_text || '' }}
          />
        </div>
      </div>
    </div>
  );
}