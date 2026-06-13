import { useState, useRef } from "react";

export function useToast(duration = 3500) {
  const [toast, setToast] = useState({ message: "", type: "success", visible: false });
  const timerRef = useRef(null);

  function showToast(message, type = "success") {
    if (timerRef.current) clearTimeout(timerRef.current);
    setToast({ message, type, visible: true });
    timerRef.current = setTimeout(
      () => setToast((t) => ({ ...t, visible: false })),
      duration
    );
  }

  return { showToast, toast };
}
