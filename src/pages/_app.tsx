import "@/styles/global.css";
import "@/styles/print.css";

import { ToastProvider } from "@/components/ui/Toast/Toast";
import AppLayout from "@/styles/layout";
import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import type { AppProps } from "next/app";
import govstarTheme from "../styles/theme";

export default function GovStar({ Component, pageProps }: AppProps) {
    return (
        <ThemeProvider theme={govstarTheme}>
            <CssBaseline />
            <ToastProvider >
                <AppLayout>
                    <Component {...pageProps} />
                </AppLayout>
            </ToastProvider>
        </ThemeProvider>
    );
}