import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { PreviewData } from "@/types/preview";
import { Checkbox } from "@/components/ui/checkbox";

interface VerificationPromptProps {
  previewData: PreviewData;
  onVerify: (password?: string) => void;
  colors: any;
}

export function VerificationPrompt({ previewData, onVerify, colors }: VerificationPromptProps) {
  const [password, setPassword] = useState("");
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const showBothPrompts = previewData.verification_type === 'both';
  const showPassword = previewData.verification_type === 'password' || showBothPrompts;
  const showAge = previewData.verification_type === 'age' || showBothPrompts;

  const handleVerification = () => {
    if (showAge && !ageConfirmed) {
      setError("Please confirm your age");
      return;
    }
    
    if (showPassword && password !== previewData.verification_password) {
      setError("Incorrect password");
      return;
    }

    onVerify(password);
  };

  return (
    <div 
      className="fixed inset-0 backdrop-blur-lg flex items-center justify-center p-4"
      style={{ backgroundColor: `${colors.background.primary}99` }} // Using alpha for transparency
    >
      <div 
        className="max-w-md w-full rounded-lg p-8 space-y-6 shadow-xl"
        style={{ backgroundColor: colors.background.secondary }}
      >
        {previewData.verification_logo_url && (
          <img 
            src={previewData.verification_logo_url} 
            alt="Verification" 
            className="h-32 mx-auto object-contain" // Increased logo size
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
            <div className="flex items-start space-x-3">
              <Checkbox
                id="age-verification"
                checked={ageConfirmed}
                onCheckedChange={(checked) => {
                  setAgeConfirmed(checked as boolean);
                  setError(null);
                }}
                className="mt-1"
              />
              <label 
                htmlFor="age-verification" 
                className="text-sm cursor-pointer"
                style={{ color: colors.font.secondary }}
              >
                {previewData.verification_age_text}
              </label>
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
                  setPassword(e.target.value);
                  setError(null);
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
            <p className="text-destructive text-sm">{error}</p>
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
  );
}