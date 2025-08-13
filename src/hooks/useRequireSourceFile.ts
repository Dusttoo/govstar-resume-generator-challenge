import useResumeStore from "@/store/resume.store";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

export interface GuardState {
    hydrated: boolean;
    ok: boolean;
    redirecting: boolean;
}

export default function useRequireSourceFile(redirectTo: string = "/"): GuardState {
    const router = useRouter();
    const fileUrl = useResumeStore((s) => s.fileUrl);

    const [hydrated, setHydrated] = useState<boolean>(
        useResumeStore.persist?.hasHydrated?.() ?? false
    );
    useEffect(() => {
        if (hydrated) return;
        const unsub = useResumeStore.persist.onFinishHydration(() => setHydrated(true));
        return unsub;
    }, [hydrated]);

    const [redirecting, setRedirecting] = useState(false);
    const hasRedirectedRef = useRef(false);

    useEffect(() => {
        if (!hydrated) return;

        if (fileUrl) {
            hasRedirectedRef.current = false;
            if (redirecting) setRedirecting(false);
            return;
        }

        if (!hasRedirectedRef.current) {
            hasRedirectedRef.current = true;
            if (!redirecting) setRedirecting(true);
            if (router.pathname !== redirectTo) {
                void router.replace(redirectTo);
            }
        }
    }, [hydrated, fileUrl, router.pathname, redirectTo, redirecting]);

    return { hydrated, ok: Boolean(fileUrl), redirecting };
}