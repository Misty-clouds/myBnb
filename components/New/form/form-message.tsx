
import { MessageType } from "./types";

  import { AlertCircle, CheckCircle2 } from "lucide-react";
  
  interface FormMessageProps {
    message: MessageType;
  }
  
  export const FormMessage = ({ message }: FormMessageProps) => {
    if (!message) return null;
  
    const isError = typeof message === 'object' 
      ? message.type === "error" || !message.type
      : true;
    
    const messageText = typeof message === 'object' ? message.message : message;
  
    return (
      <div
        className={`flex items-center gap-2 rounded-lg p-3 text-sm ${
          isError
            ? "bg-destructive/15 text-destructive"
            : "bg-emerald-500/15 text-emerald-500"
        }`}
      >
        {isError ? (
          <AlertCircle className="h-4 w-4" />
        ) : (
          <CheckCircle2 className="h-4 w-4" />
        )}
        {messageText}
      </div>
    );
  };