import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Skeleton from '@mui/material/Skeleton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import * as React from 'react';

import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import FitScreenIcon from '@mui/icons-material/FitScreen';
import LastPageIcon from '@mui/icons-material/LastPage';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';

import workerSrc from 'pdfjs-dist/build/pdf.worker.min.mjs';
import { Document, Page, pdfjs } from 'react-pdf';

import { canvasAreaSx, controlsLeftSx, controlsRightSx, errorBoxSx, pageFrameSx, toolbarSx, wrapperSx } from './PdfPreview.styles';
import type { PdfPreviewProps } from './PdfPreview.types';

if (typeof window !== 'undefined') {
    // @ts-ignore
    pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;
}

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

export default function PdfPreview({ fileUrl, initialScale = 1, onLoad, onError, className }: PdfPreviewProps) {
    const [numPages, setNumPages] = React.useState<number>(0);
    const [page, setPage] = React.useState<number>(1);
    const [scale, setScale] = React.useState<number>(initialScale);
    const [fitToWidth, setFitToWidth] = React.useState<boolean>(true);
    const containerRef = React.useRef<HTMLDivElement | null>(null);
    const [containerWidth, setContainerWidth] = React.useState<number>(0);

    const hasFile = Boolean(fileUrl);

    React.useEffect(() => {
        if (!containerRef.current) return;
        const el = containerRef.current;
        const ro = new ResizeObserver((entries) => {
            const w = entries[0].contentRect.width;
            setContainerWidth(w);
        });
        ro.observe(el);
        return () => ro.disconnect();
    }, []);

    const pageWidth = React.useMemo(() => {
        if (!fitToWidth) return undefined;
        return Math.max(100, containerWidth - 32);
    }, [fitToWidth, containerWidth]);

    const zoomIn = () => {
        setFitToWidth(false);
        setScale((s) => clamp(s + 0.1, 0.5, 3));
    };
    const zoomOut = () => {
        setFitToWidth(false);
        setScale((s) => clamp(s - 0.1, 0.5, 3));
    };
    const toggleFit = () => setFitToWidth((v) => !v);

    const goFirst = () => setPage(1);
    const goLast = () => setPage(numPages || 1);
    const prev = () => setPage((p) => clamp(p - 1, 1, numPages || 1));
    const next = () => setPage((p) => clamp(p + 1, 1, numPages || 1));

    const openNew = () => window.open(fileUrl, '_blank', 'noopener,noreferrer');
    const download = () => {
        const a = document.createElement('a');
        a.href = fileUrl;
        a.download = 'resume.pdf';
        document.body.appendChild(a);
        a.click();
        a.remove();
    };

    const handleLoadSuccess = ({ numPages: pages }: { numPages: number }) => {
        setNumPages(pages);
        setPage(1);
        onLoad?.(pages);
    };

    const handleLoadError = (err: Error) => {
        onError?.(err);
    };
    if (!hasFile) {
        return (
            <Box sx={wrapperSx} className={className}>
                <Box sx={toolbarSx} />
                <Box sx={canvasAreaSx} ref={containerRef}>
                    <Box sx={pageFrameSx}>
                        <Skeleton variant="rounded" width={Math.max(100, (containerWidth || 480) - 32)} height={640} />
                    </Box>
                </Box>
            </Box>
        );
    }

    return (
        <Box sx={wrapperSx} className={className}>
            <Box sx={toolbarSx}>
                <Box sx={controlsLeftSx}>
                    <Tooltip title="First page"><span><IconButton onClick={goFirst} disabled={page <= 1}><FirstPageIcon /></IconButton></span></Tooltip>
                    <Tooltip title="Previous"><span><IconButton onClick={prev} disabled={page <= 1}><ChevronLeftIcon /></IconButton></span></Tooltip>
                    <Typography variant="body2">Page {page} / {numPages || '—'}</Typography>
                    <Tooltip title="Next"><span><IconButton onClick={next} disabled={page >= numPages}><ChevronRightIcon /></IconButton></span></Tooltip>
                    <Tooltip title="Last page"><span><IconButton onClick={goLast} disabled={page >= numPages}><LastPageIcon /></IconButton></span></Tooltip>
                </Box>
                <Box sx={controlsRightSx}>
                    <Tooltip title="Zoom out"><span><IconButton onClick={zoomOut}><ZoomOutIcon /></IconButton></span></Tooltip>
                    <Typography variant="body2">{Math.round((fitToWidth ? 100 : scale * 100))}%</Typography>
                    <Tooltip title="Zoom in"><span><IconButton onClick={zoomIn}><ZoomInIcon /></IconButton></span></Tooltip>
                    <Divider flexItem orientation="vertical" sx={{ mx: 1 }} />
                    <Tooltip title={fitToWidth ? 'Disable fit to width' : 'Fit to width'}>
                        <span><IconButton onClick={toggleFit}><FitScreenIcon /></IconButton></span>
                    </Tooltip>
                    <Divider flexItem orientation="vertical" sx={{ mx: 1 }} />
                    <Tooltip title="Open in new tab"><span><IconButton onClick={openNew}><OpenInNewIcon /></IconButton></span></Tooltip>
                    <Tooltip title="Download PDF"><span><IconButton onClick={download}><PictureAsPdfIcon /></IconButton></span></Tooltip>
                </Box>
            </Box>

            <Box sx={canvasAreaSx} ref={containerRef}>
                <Box sx={pageFrameSx}>
                    <Document
                        key={fileUrl}
                        file={fileUrl}
                        loading={<Skeleton variant="rounded" width={pageWidth ?? 480} height={640} />}
                        onLoadSuccess={handleLoadSuccess}
                        onLoadError={handleLoadError}
                        error={<Box sx={errorBoxSx}>Failed to load PDF.</Box>}
                        noData={<Box sx={errorBoxSx}>No PDF to display.</Box>}
                        renderMode="canvas"
                    >
                        <Page
                            pageNumber={page}
                            width={pageWidth}
                            scale={fitToWidth ? undefined : scale}
                            renderAnnotationLayer={false}
                            renderTextLayer={false}
                            className="pdf-page"
                        />
                    </Document>
                </Box>
            </Box>
        </Box>
    );
}
