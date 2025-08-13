import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { headerRowSx, stepItemSx, stepNumSx, stepsWrapSx, titleColSx, wrapSx } from './TitleBar.styles';
import type { TitleBarProps, TitleBarVariant } from './TitleBar.types';

const HOME_STEPS = [
    { title: 'Upload your PDF resume', desc: 'We accept PDF files up to ~10MB.' },
    { title: 'Add instructions', desc: 'Target role, tone, and keywords to emphasize.' },
    { title: 'Generate & refine', desc: 'Preview the styled resume, then refine and regenerate.' },
];

function inferVariant(pathname: string): TitleBarVariant {
    if (pathname.startsWith('/preview')) return 'preview';
    if (pathname.startsWith('/generate')) return 'generate';
    return 'home';
}

export default function TitleBar({ variant, title, subtitle, actions, hideSteps, className }: TitleBarProps) {
    const router = useRouter();
    const v = variant ?? inferVariant(router.pathname);

    const derived: { title: string; subtitle?: string; showSteps: boolean } = useMemo(() => {
        switch (v) {
            case 'home':
                return {
                    title: title ?? 'GovStar Resume Generator',
                    subtitle:
                        subtitle ?? 'Upload a PDF, tell us what to emphasize, and we’ll style it in GovStar’s format. You can refine on the next screen.',
                    showSteps: hideSteps ? false : true,
                };
            case 'preview':
                return {
                    title: title ?? 'Preview your styled resume',
                    subtitle: subtitle ?? 'Review the output, then adjust the instructions and regenerate as needed.',
                    showSteps: false,
                };
            case 'generate':
                return {
                    title: title ?? 'Preparing your preview…',
                    subtitle: subtitle ?? undefined,
                    showSteps: false,
                };
            default:
                return { title: title ?? '', subtitle, showSteps: false };
        }
    }, [v, title, subtitle, hideSteps]);

    return (
        <Box sx={wrapSx} className={className}>
            <Box sx={headerRowSx}>
                <Stack sx={titleColSx}>
                    <Stack direction="row" spacing={1.25} alignItems="center">
                        <Typography variant="h2">{derived.title}</Typography>
                    </Stack>
                    {derived.subtitle && (
                        <Typography variant="body2" color="text.secondary">
                            {derived.subtitle}
                        </Typography>
                    )}
                </Stack>
                {actions}
            </Box>

            {derived.showSteps && (
                <Box sx={stepsWrapSx}>
                    {HOME_STEPS.map((s, idx) => (
                        <Stack key={idx} direction="row" sx={stepItemSx}>
                            <Box sx={stepNumSx}>{idx + 1}</Box>
                            <div>
                                <Typography variant="subtitle1">{s.title}</Typography>
                                <Typography variant="body2" color="text.secondary">{s.desc}</Typography>
                            </div>
                        </Stack>
                    ))}
                </Box>
            )}
        </Box>
    );
}
