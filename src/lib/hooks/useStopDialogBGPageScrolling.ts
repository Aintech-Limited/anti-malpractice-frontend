import { useCallback, useEffect } from "react";

const useStopDialogBGPageScrolling = ({
  onClose,
  isOpen,
}: {
  isOpen: boolean;
  onClose?: () => void;
}) => {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose?.();
    },
    [onClose],
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden"; // Prevent background scrolling
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, handleKeyDown]);

  return null;
};

export default useStopDialogBGPageScrolling;
