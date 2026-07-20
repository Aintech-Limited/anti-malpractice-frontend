"use client";

import { useEffect } from "react";
import { toast } from "react-toastify";

export const SHORTCUTS_TO_BLOCK = ["c", "v", "u", "s", "p", "x", "a"];

export const useSecurityLockdown = () => {
  useEffect(() => {
    const preventCheating = (
      e: KeyboardEvent | ClipboardEvent | MouseEvent,
    ) => {
      // Prevent Right Click
      if (e.type === "contextmenu") {
        e.preventDefault();
        toast.error("Right-click is disabled during the exam.");
      }

      // Prevent Copy/Paste/Cut
      if (["copy", "paste", "cut"].includes(e.type)) {
        e.preventDefault();
        toast.error("Clipboard actions are disabled.");
      }

      if (e instanceof KeyboardEvent) {
        const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
        const cmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;

        // Block Ctrl+C, Ctrl+V, Ctrl+U (View Source), Ctrl+S (Save), Ctrl+P (Print)
        if (cmdOrCtrl && SHORTCUTS_TO_BLOCK.includes(e.key.toLowerCase())) {
          e.preventDefault();
          toast.error(`Shortcut ${e.key.toUpperCase()} is blocked.`);
        }

        // Block F12 and Ctrl+Shift+I (DevTools)
        if (
          e.key === "F12" ||
          (cmdOrCtrl && e.shiftKey && e.key.toLowerCase() === "i")
        ) {
          e.preventDefault();
          toast.warning("Developer Tools access is a violation.");
        }
      }
    };

    document.addEventListener("contextmenu", preventCheating);
    document.addEventListener("copy", preventCheating);
    document.addEventListener("paste", preventCheating);
    document.addEventListener("cut", preventCheating);
    document.addEventListener("keydown", preventCheating);

    return () => {
      document.removeEventListener("contextmenu", preventCheating);
      document.removeEventListener("copy", preventCheating);
      document.removeEventListener("paste", preventCheating);
      document.removeEventListener("cut", preventCheating);
      document.removeEventListener("keydown", preventCheating);
    };
  }, []);
};
