import { AlertTriangle, RefreshCw } from "lucide-react";

interface ErrorPanelProps {
  message: string;
  onRetry?: () => void;
}

export default function ErrorPanel({ message, onRetry }: ErrorPanelProps) {
  return (
    <div className="error-panel">
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-error" aria-hidden="true" />
        <p className="text-sm leading-6 text-ink">{message}</p>
      </div>
      {onRetry ? (
        <button type="button" className="key shrink-0" onClick={onRetry}>
          <RefreshCw className="h-4 w-4" aria-hidden="true" />
          Retry
        </button>
      ) : null}
    </div>
  );
}
