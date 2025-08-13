import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import * as React from "react";

export type ToastSeverity = "success" | "info" | "warning" | "error";

export interface ToastOptions {
    severity?: ToastSeverity;
    autoHideDuration?: number;
}

interface ToastItem extends ToastOptions {
    id: number;
    message: string;
}

interface ToastContextValue {
    showToast: (message: string, options?: ToastOptions) => void;
}

const ToastContext = React.createContext<ToastContextValue | undefined>(undefined);

export function useToast() {
    const ctx = React.useContext(ToastContext);
    if (!ctx) throw new Error("useToast must be used within <ToastProvider>");
    return ctx;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const queueRef = React.useRef<ToastItem[]>([]);
    const [current, setCurrent] = React.useState<ToastItem | null>(null);
    const [open, setOpen] = React.useState(false);
    const counterRef = React.useRef(1);

    const processQueue = React.useCallback(() => {
        if (current || open) return;
        const next = queueRef.current.shift();
        if (next) {
            setCurrent(next);
            setOpen(true);
        }
    }, [current, open]);

    const showToast = React.useCallback((message: string, options?: ToastOptions) => {
        queueRef.current.push({ id: counterRef.current++, message, severity: options?.severity ?? "info", autoHideDuration: options?.autoHideDuration ?? 3500 });
        processQueue();
    }, [processQueue]);

    const handleClose = (_?: unknown, reason?: string) => {
        if (reason === "clickaway") return;
        setOpen(false);
    };

    const handleExited = () => {
        setCurrent(null);
        processQueue();
    };

    const value = React.useMemo(() => ({ showToast }), [showToast]);

    return (
        <ToastContext.Provider value={value}>
            {children}
            <Snackbar
                key={current?.id}
                open={open}
                autoHideDuration={current?.autoHideDuration}
                onClose={handleClose}
                TransitionProps={{ onExited: handleExited }}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            >
                <Alert onClose={handleClose} severity={current?.severity ?? "info"} variant="filled" sx={{ width: "100%" }}>
                    {current?.message}
                </Alert>
            </Snackbar>
        </ToastContext.Provider>
    );
}
