import useResumeStore from "@/store/resume.store";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

export interface GuardState {
    hydrated: boolean;
    ok: boolean;
    redirecting: boolean;
}

export default function useRequireResult(redirectTo: string = "/"): GuardState {
    const router = useRouter();
    const resultPdfUrl = useResumeStore((s) => s.result?.pdfUrl ?? null);

    const initialHydrated = useResumeStore.persist?.hasHydrated?.() ?? false;
    const hydratedRef = useRef<boolean>(initialHydrated);
    const [hydrated, setHydrated] = useState<boolean>(hydratedRef.current);

    useEffect(() => {
        if (hydrated) return;
        const unsub = useResumeStore.persist.onFinishHydration(() => {
            setHydrated(true);
        });
        return unsub;
    }, [hydrated]);

    const [redirecting, setRedirecting] = useState(false);
    useEffect(() => {
        if (!hydrated) return;
        if (!resultPdfUrl) {
            setRedirecting(true);
            if (router.pathname !== redirectTo) {
                router.replace(redirectTo);
            }
        } else {
            setRedirecting(false);
        }
    }, [hydrated, resultPdfUrl, router, redirectTo]);

    return { hydrated, ok: Boolean(resultPdfUrl), redirecting };
}