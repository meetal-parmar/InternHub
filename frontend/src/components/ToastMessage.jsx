import { useEffect } from "react";

export default function ToastMessage({ message, type, onClose }) {

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{
      position: "fixed",
      top: "20px",
      right: "20px",
      zIndex: 9999
    }}>
      <div className={`alert alert-${type} shadow`}>
        {message}
      </div>
    </div>
  );
}