import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type GenerationStatus = "idle" | "uploading" | "generating" | "ready" | "error";

export interface GenerationResult {
    pdfUrl: string;
    meta?: Record<string, any>;
}

export interface ParsedResume {
    name?: string;
    title?: string;
    email?: string;
    phone?: string;
    location?: string;
    links?: { label: string; url: string }[];
    skills?: string[];
    summary?: string;
    experience?: Array<{
        company: string;
        role: string;
        range?: string;
        location?: string;
        bullets: string[];
    }>;
    education?: { school: string; degree?: string; year?: string };
    isScanned?: boolean;
}

export type RefinementTone = "concise" | "impactful" | "formal" | "friendly" | "technical";

export interface Refinements {
    targetRole?: string;
    targetCompany?: string;
    tone?: RefinementTone;
    keywords?: string[];
    keepOriginalSummary?: boolean;
    additionalNotes?: string;
}

interface ResumeStore {
    file: File | null;
    fileUrl: string | null;
    prompt: string;
    status: GenerationStatus;
    result: GenerationResult | null;
    error: string | null;

    parsed: ParsedResume | null;
    refinements: Refinements | null;

    setFile: (file: File) => void;
    replaceFile: (file: File) => void;
    clearFile: () => void;

    setPrompt: (prompt: string) => void;

    startUploading: () => void;
    startGenerating: () => void;

    setResult: (result: GenerationResult) => void;

    fail: (error: string) => void;
    setError: (error: string | null) => void;

    setParsed: (parsed: ParsedResume | null) => void;
    setRefinements: (ref: Refinements | null) => void;

    reset: () => void;
}

const safeRevoke = (url?: string | null) => {
    if (!url) return;
    try {
        URL.revokeObjectURL(url);
    } catch {
        // no-op
    }
};

const useResumeStore = create<ResumeStore>()(
    persist(
        (set, get) => ({
            file: null,
            fileUrl: null,
            prompt: "",
            status: "idle",
            result: null,
            error: null,

            parsed: null,
            refinements: null,

            setFile: (file: File) => {
                const prevFileUrl = get().fileUrl;
                if (prevFileUrl) safeRevoke(prevFileUrl);
                const fileUrl = URL.createObjectURL(file);
                set({ file, fileUrl, result: null, parsed: null, status: "idle", error: null });
            },

            replaceFile: (file: File) => {
                const { fileUrl: prevFileUrl, result: prevResult } = get();
                if (prevFileUrl) safeRevoke(prevFileUrl);
                if (prevResult?.pdfUrl) safeRevoke(prevResult.pdfUrl);
                const fileUrl = URL.createObjectURL(file);
                set({ file, fileUrl, result: null, parsed: null, status: "idle", error: null });
            },

            clearFile: () => {
                const { fileUrl } = get();
                if (fileUrl) safeRevoke(fileUrl);
                set({ file: null, fileUrl: null });
            },

            setPrompt: (prompt: string) => set({ prompt }),

            startUploading: () => set({ status: "uploading", error: null }),
            startGenerating: () => set({ status: "generating", error: null }),

            setResult: (result: GenerationResult) => {
                const prev = get().result?.pdfUrl;
                if (prev) safeRevoke(prev);
                set({ result, status: "ready", error: null });
            },

            fail: (error: string) => set({ status: "error", error }),
            setError: (error: string | null) => set({ error }),

            setParsed: (parsed: ParsedResume | null) => set({ parsed }),
            setRefinements: (ref: Refinements | null) => set({ refinements: ref }),

            reset: () => {
                const { fileUrl, result } = get();
                if (fileUrl) safeRevoke(fileUrl);
                if (result?.pdfUrl) safeRevoke(result.pdfUrl);
                set({
                    file: null,
                    fileUrl: null,
                    prompt: "",
                    status: "idle",
                    result: null,
                    error: null,
                    parsed: null,
                    refinements: null,
                });
            },
        }),
        {
            name: "resume-store",
            storage: createJSONStorage(() => {
                if (typeof window !== "undefined") return window.sessionStorage;
                return {
                    getItem: () => null,
                    setItem: () => { },
                    removeItem: () => { },
                    clear: () => { },
                    key: () => null,
                    length: 0,
                } as unknown as Storage;
            }),
            partialize: (state) => ({
                fileUrl: state.fileUrl,
                prompt: state.prompt,
                result: state.result,
                error: state.error,
                parsed: state.parsed,
                refinements: state.refinements,
            }),
            version: 2,
        }
    )
);

export default useResumeStore;
