import RefinementPanel from '@/components/RefinementPanel/RefinementPanel';
import TitleBar from '@/components/TitleBar/TitleBar';
import Button from '@/components/ui/Button/Button';
import { renderResumeBlobUrl, STATIC_SAMPLE_URL } from '@/lib/generator';
import { SAMPLE_PARSED } from '@/sample/parsed.example';
import useResumeStore from '@/store/resume.store';
import DownloadIcon from '@mui/icons-material/Download';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { Box, Container, Grid, Stack } from '@mui/material';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import * as React from 'react';

const PdfPreview = dynamic(() => import('@/components/PdfPreview/PdfPreview'), { ssr: false });

export default function PreviewPage() {
    const router = useRouter();

    const status = useResumeStore((s) => s.status);
    const refinements = useResumeStore((s) => s.refinements);
    const resultPdfUrl = useResumeStore((s) => s.result?.pdfUrl ?? '');
    const effectiveUrl = resultPdfUrl || STATIC_SAMPLE_URL;
    const setResult = useResumeStore((s) => s.setResult);
    const startGenerating = useResumeStore((s) => s.startGenerating);
    const fail = useResumeStore((s) => s.fail);
    const reset = useResumeStore((s) => s.reset);

    const handleDownload = () => {
        const url = effectiveUrl;
        if (!url) return;
        window.open(url, '_blank', 'noopener');
    };

    const handleStartOver = () => {
        try {
            if (typeof window !== 'undefined') {
                window.sessionStorage.removeItem('resume-store');
            }
        } catch { }
        reset();
        router.push('/');
    };

    const inFlightRef = React.useRef(false);
    React.useEffect(() => {
        if (status !== 'generating') return;
        if (inFlightRef.current) return;
        inFlightRef.current = true;

        let mounted = true;
        (async () => {
            try {
                const url = await renderResumeBlobUrl(SAMPLE_PARSED, refinements);
                if (!mounted) return;
                setResult({ pdfUrl: url });
            } catch (e) {
                if (!mounted) return;
                fail('Regeneration failed. Please try again.');
            } finally {
                inFlightRef.current = false;
            }
        })();

        return () => {
            mounted = false;
        };
    }, [status, refinements, setResult, fail]);

    const handleRegenerate = () => {
        startGenerating();
    };

    return (
        <Container maxWidth="lg">
            <TitleBar variant="preview" title="Preview" subtitle="Your resume is ready to download." />

            <Grid container spacing={3} alignItems="flex-start" sx={{ mt: 2 }}>
                <Grid size={{ xs: 12, md: 7 }}>
                    <Stack spacing={1.5}>
                        <PdfPreview
                            fileUrl={effectiveUrl}
                            onLoad={(pages) => {

                                console.log('[PdfPreview] loaded', { pages, url: effectiveUrl });
                            }}
                            onError={(err) => {
                                console.error('[PdfPreview] error', err);
                            }}
                        />
                        <Box display="flex" justifyContent="flex-start">
                            <Button variant="outlined" onClick={handleDownload} startIcon={<DownloadIcon />}>
                                Download PDF
                            </Button>
                        </Box>
                    </Stack>
                </Grid>

                <Grid size={{ xs: 12, md: 5 }}>
                    <Stack spacing={1.5}>
                        <RefinementPanel
                            loading={status === 'generating'}
                            onRegenerate={handleRegenerate}
                        />
                        <Box display="flex" justifyContent="flex-end">
                            <Button variant="text" color="inherit" onClick={handleStartOver} endIcon={<RestartAltIcon />}>
                                Start over
                            </Button>
                        </Box>
                    </Stack>
                </Grid>
            </Grid>
        </Container>
    );
}
