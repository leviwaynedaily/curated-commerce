import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { PreviewData } from "@/types/preview";

interface VerificationPromptProps {
  previewData: PreviewData;
  onVerify: (password?: string) => void;
  colors: any;
}

export function VerificationPrompt({ previewData, onVerify, colors }: VerificationPromptProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const showBothPrompts = previewData.verification_type === 'both';
  const showPassword = previewData.verification_type === 'password' || showBothPrompts;
  const showAge = previewData.verification_type === 'age' || showBothPrompts;

  const handleVerification = () => {
    if (showPassword && password !== previewData.verification_password) {
      setError("Incorrect password");
      return;
    }
    onVerify(password);
  };

  return (
    <div className="max-w-md w-full p-6 rounded-lg space-y-6" style={{ backgroundColor: colors.background.secondary }}>
      {previewData.verification_logo_url && (
        <img 
          src={previewData.verification_logo_url} 
          alt="Verification" 
          className="h-16 mx-auto mb-6"
        />
      )}
      
      <div className="space-y-4">
        {showAge && (
          <div className="space-y-4">
            <p style={{ color: colors.font.primary }}>{previewData.verification_age_text}</p>
          </div>
        )}

        {showPassword && (
          <div className="space-y-2">
            <Input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(null);
              }}
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>
        )}

        <Button 
          className="w-full"
          style={{
            backgroundColor: colors.background.accent,
            color: colors.font.primary
          }}
          onClick={handleVerification}
        >
          {showBothPrompts ? 'Verify Age & Password' : showAge ? 'Confirm Age' : 'Enter Site'}
        </Button>
      </div>

      <p 
        className="text-sm text-center"
        style={{ color: colors.font.secondary }}
      >
        {previewData.verification_legal_text}
      </p>
    </div>
  );
}