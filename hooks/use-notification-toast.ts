import { useCallback } from "react";
import { toast } from "sonner";

type Variant = "success" | "error";
type Position = "top-left" | "top-right" | "bottom-left" | "bottom-right";

export const useToast = () => {
  const showToast = useCallback(
    (message: JSX.Element | string, variant: Variant, position: Position = "top-right") => {
      if (variant === "success") {
        toast.success(message, {
          position,
          className: "text-green-700",
        });
      } else if (variant === "error") {
        toast.error(message, {
          position,
          className: "text-red-700",
        });
      }
    },
    []
  );

  return { showToast };
};
