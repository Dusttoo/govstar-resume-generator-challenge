import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import * as React from "react";

import Triangle from "@/components/brand/Triangle";
import Button from "@/components/ui/Button/Button";
import { actionsRowSx, copyWrapSx, stepItemSx, stepsWrapSx, triangleWrapSx, triWordItemSx, triWordsRowSx } from "./LoadingIndicator.styles";

export type LoadingIndicatorProps = {
    title?: string;
    steps?: string[];
    activeStep?: number;
    showCancel?: boolean;
    onCancel?: () => void;
    size?: "sm" | "md" | "lg";
    syncStepsWithWords?: boolean;
    edgeDurationMs?: number;
    className?: string;
};

const DEFAULT_STEPS = ["Parsing your PDF", "Applying GovStar style", "Rendering preview"];
const BRAND_WORDS = ["Strategy", "Design", "Engineering"];

export default function LoadingIndicator({
    title = "Generating your GovStar resume…",
    steps = DEFAULT_STEPS,
    activeStep = 0,
    showCancel = false,
    onCancel,
    size = "md",
    syncStepsWithWords = false,
    edgeDurationMs = 1800,
    className,
}: LoadingIndicatorProps) {
    const theme = useTheme();
    const prefersReduced = useMediaQuery("(prefers-reduced-motion: reduce)", { noSsr: true });

    const [wordIndex, setWordIndex] = React.useState(0);
    React.useEffect(() => {
        if (prefersReduced) return;
        const id = window.setInterval(() => setWordIndex((i) => (i + 1) % 3), edgeDurationMs);
        return () => window.clearInterval(id);
    }, [edgeDurationMs, prefersReduced]);

    const stepIndex = syncStepsWithWords ? wordIndex : (activeStep ?? 0);

    return (
        <Stack spacing={3} alignItems="stretch" className={className} role="status" aria-live="polite" aria-atomic>
            <Box sx={triangleWrapSx}>
                <Triangle
                    size={size === "lg" ? 200 : size === "md" ? 160 : 120}
                    trace={!prefersReduced}
                    traceColor={theme.palette.secondary.main}
                    traceDurationMs={edgeDurationMs * 3}
                    colors={{ outer: theme.palette.secondary.main, middle: theme.palette.primary.main, inner: theme.palette.text.primary }}
                />
                <Box sx={triWordsRowSx}>
                    {BRAND_WORDS.map((w, i) => (
                        <Typography key={w} variant="h5" sx={triWordItemSx(i, wordIndex)}>
                            {w}
                        </Typography>
                    ))}
                </Box>
            </Box>

            <Stack spacing={1.25} sx={copyWrapSx}>
                <Typography variant="h3">{title}</Typography>
                <Box sx={stepsWrapSx}>
                    {steps.map((step, idx) => (
                        <Typography key={idx} variant="body2" sx={stepItemSx(idx === stepIndex)}>
                            {step}
                        </Typography>
                    ))}
                </Box>
            </Stack>

            {showCancel && (
                <Box sx={actionsRowSx}>
                    <Button variant="outlined" color="inherit" onClick={onCancel}>
                        Cancel
                    </Button>
                </Box>
            )}
        </Stack>
    );
}