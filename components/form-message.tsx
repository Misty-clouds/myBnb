export type Message = {
  message?: string;
  type?: string;
};

export function FormMessage({ message }: { message: Message }) {
  if (!message.message) return null;

  const messageType = message.type || 'info';

  return (
    <div className="flex flex-col gap-2 w-full max-w-md text-sm">
      <div className={`border-l-2 px-4 ${
        messageType === 'error' 
          ? 'text-destructive-foreground border-destructive-foreground' 
          : messageType === 'success'
          ? 'text-foreground border-foreground'
          : 'text-foreground border-foreground'
      }`}>
        {message.message}
      </div>
    </div>
  );
}