import { Button } from "@/components/ui/button";
import { PreviewData } from "@/types/preview";

interface InstructionsModalProps {
  previewData: PreviewData;
  onClose: () => void;
  modalRef: React.RefObject<HTMLDivElement>;
}

export function InstructionsModal({ previewData, onClose, modalRef }: InstructionsModalProps) {
  return (
    <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm">
      <div className="h-full w-full flex items-center justify-center p-4">
        <div ref={modalRef} className="w-[400px] rounded-lg shadow-xl bg-white p-6 space-y-6">
          {previewData.logo_url && (
            <img 
              src={previewData.logo_url} 
              alt={previewData.name} 
              className="h-16 mx-auto object-contain"
            />
          )}
          
          <h2 className="text-xl font-semibold text-center">
            Welcome to {previewData.name}
          </h2>
          
          <div 
            className="prose prose-sm max-w-none [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-5 [&_ol]:pl-5 [&_li]:text-inherit space-y-4"
            dangerouslySetInnerHTML={{ __html: previewData.instructions_text || '' }}
          />

          <Button
            className="w-full"
            onClick={onClose}
            style={{ 
              backgroundColor: previewData.verification_button_color,
              color: '#FFFFFF',
              border: 'none'
            }}
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}