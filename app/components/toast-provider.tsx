"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { CheckCircle2, X, XCircle } from "lucide-react";
import { AUTH_TOAST_STORAGE_KEY } from "../lib/auth-toast";

type ToastType = "success" | "error";
type ToastMessage = { id: number; message: string; type: ToastType };
type ToastContextValue = {
  showToast: (message: string, type?: ToastType) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider.");
  }
  return context;
}

export default function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const showToast = useCallback((message: string, type: ToastType = "success") => {
    const id = Date.now() + Math.random();
    setToasts((current) => [...current, { id, message, type }]);
  }, []);
  const dismissToast = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  useEffect(() => {
    const queuedToast = window.sessionStorage.getItem(AUTH_TOAST_STORAGE_KEY);
    if (!queuedToast) return;

    window.sessionStorage.removeItem(AUTH_TOAST_STORAGE_KEY);
    const timer = window.setTimeout(() => {
      try {
        const { message, type } = JSON.parse(queuedToast) as {
          message: string;
          type: ToastType;
        };
        showToast(message, type);
      } catch {
        showToast("আপনার অনুরোধটি সম্পন্ন হয়েছে।");
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, [showToast]);

  useEffect(() => {
    if (toasts.length === 0) return;
    const timers = toasts.map((toast) =>
      window.setTimeout(() => dismissToast(toast.id), 4500),
    );
    return () => timers.forEach(window.clearTimeout);
  }, [dismissToast, toasts]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div
        aria-live="polite"
        className="fixed top-4 right-4 z-[100] flex w-[min(22rem,calc(100vw-2rem))] flex-col gap-2"
      >
        {toasts.map((toast) => {
          const Icon = toast.type === "success" ? CheckCircle2 : XCircle;
          return (
            <div
              className={`flex items-start gap-2 rounded-lg border bg-white p-3 text-sm shadow-lg ${
                toast.type === "success"
                  ? "border-[#cce8d3] text-[#176c45]"
                  : "border-[#f3cecc] text-[#a8322e]"
              }`}
              key={toast.id}
              role={toast.type === "error" ? "alert" : "status"}
            >
              <Icon aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
              <p className="m-0 flex-1">{toast.message}</p>
              <button
                aria-label="নোটিফিকেশন বন্ধ করুন"
                className="rounded p-0.5 opacity-70 hover:bg-black/5 hover:opacity-100"
                onClick={() => dismissToast(toast.id)}
                type="button"
              >
                <X aria-hidden="true" className="size-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
