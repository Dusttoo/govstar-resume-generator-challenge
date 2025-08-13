import Button from "@/components/ui/Button/Button";
import useResumeStore from "@/store/resume.store";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/router";
import * as React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { counterRowSx, fieldSx, presetsRowSx } from "./PromptEditor.styles";
import type { PromptEditorProps } from "./PromptEditor.types";

function useDebouncedCallback(fn: (v: string) => void, delay: number) {
    const fnRef = useRef(fn);
    useEffect(() => {
        fnRef.current = fn;
    }, [fn]);

    const timeoutRef = useRef<number | null>(null);
    useEffect(() => () => { if (timeoutRef.current) window.clearTimeout(timeoutRef.current); }, []);

    return (v: string) => {
        if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
        timeoutRef.current = window.setTimeout(() => fnRef.current(v), delay);
    };
}

const DEFAULT_HELPER = "Describe what to emphasize (roles, skills, tone, target company, keywords).";

const DEFAULT_PRESETS: string[] = [
    "Target role: Senior Backend Engineer; focus on Python, Django, MySQL, CI/CD.",
    "Emphasize security clearances, compliance, and government project work.",
    "Tone: concise, results-driven; highlight performance, scale, and reliability.",
    "Tailor to GovStar; highlight PWA experience and search implementation ownership.",
];

export default function PromptEditor({
    label = "Instructions for tailoring",
    placeholder = "E.g., Emphasize leadership, system design, and measurable outcomes. Target role is ...",
    minRows = 6,
    maxChars = 1000,
    disabled = false,
    autoFocus = false,
    helperText = DEFAULT_HELPER,
    showPresets = true,
    className,
    onApply,
}: PromptEditorProps) {
    const router = useRouter();

    const isHome = router.pathname === "/";

    const storePrompt = useResumeStore((s) => s.prompt);
    const setPrompt = useResumeStore((s) => s.setPrompt);
    const status = useResumeStore((s) => s.status);
    const result = useResumeStore((s) => s.result);
    const startUploading = useResumeStore((s) => s.startUploading);
    const startGenerating = useResumeStore((s) => s.startGenerating);

    const [value, setValue] = useState<string>(storePrompt ?? "");

    useEffect(() => {
        setValue(storePrompt ?? "");
    }, [storePrompt]);

    const debouncedSync = useDebouncedCallback((v) => setPrompt(v), 250);

    const remaining = Math.max(0, maxChars - value.length);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const next = e.target.value;
        const clipped = next.length > maxChars ? next.slice(0, maxChars) : next;
        setValue(clipped);
        debouncedSync(clipped);
    };

    const hasResult = Boolean(result?.pdfUrl);
    const loading = !isHome && (status === "uploading" || status === "generating");

    const handlePrimary = () => {
        setPrompt(value);
        onApply?.(value);

        if (hasResult) {
            startGenerating();
            return;
        }
        startUploading();
        router.push("/generate");
    };

    const presets = useMemo(() => DEFAULT_PRESETS, []);

    return (
        <Stack spacing={1.5} className={className}>
            {showPresets && (
                <div style={{ marginBottom: 4 }}>
                    <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                        Quick presets
                    </Typography>
                    <div style={{ overflowX: "auto" }}>
                        <Stack direction="row" sx={presetsRowSx}>
                            {presets.map((p, idx) => (
                                <Chip
                                    key={idx}
                                    label={p}
                                    variant="outlined"
                                    onClick={() => {
                                        const next = p.length > maxChars ? p.slice(0, maxChars) : p;
                                        setValue(next);
                                        setPrompt(next);
                                    }}
                                />
                            ))}
                        </Stack>
                    </div>
                </div>
            )}

            <TextField
                label={label}
                placeholder={placeholder}
                value={value}
                onChange={handleChange}
                minRows={minRows}
                multiline
                fullWidth
                disabled={disabled}
                autoFocus={autoFocus}
                sx={fieldSx}
                helperText={helperText}
            />

            <Stack direction="row" sx={counterRowSx}>
                <Typography variant="caption">Characters: {value.length}/{maxChars}</Typography>
                <Button onClick={handlePrimary} variant="contained" color="secondary" loading={loading}>
                    {hasResult ? "Refine & Regenerate" : "Generate Resume"}
                </Button>
            </Stack>
        </Stack>
    );
}
