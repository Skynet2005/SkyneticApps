import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

interface FormErrorProps {
  message?: string;
}

export const FormError: React.FC<FormErrorProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div className="flex items-center gap-x-2 p-3 text-sm text-destructive bg-destructive/15 rounded-md">
      <ExclamationTriangleIcon className="w-4 h-4" />
      <p className="text-red-900">{message}</p>
    </div>
  );
};
