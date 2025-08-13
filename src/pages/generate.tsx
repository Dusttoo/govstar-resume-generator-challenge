import LoadingIndicator from '@/components/LoadingIndicator/LoadingIndicator';
import { generateFromSample } from '@/lib/generator';
import useResumeStore from '@/store/resume.store';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';

const MIN_LOAD_MS = 9000;
const JITTER_MS = 600;

function sleep(ms: number) { return new Promise<void>((resolve) => setTimeout(resolve, ms)); }
function withJitter(ms: number, jitter: number = JITTER_MS) {
    const delta = Math.round((Math.random() * 2 - 1) * jitter);
    return Math.max(0, ms + delta);
}

export default function GeneratePage() {
    const router = useRouter();

    const startGenerating = useResumeStore((s) => s.startGenerating);
    const setResult = useResumeStore((s) => s.setResult);
    const setParsed = useResumeStore((s) => s.setParsed);
    const fail = useResumeStore((s) => s.fail);
    const refinements = useResumeStore((s) => s.refinements);

    const [active, setActive] = useState(0);
    const startedRef = useRef(false);

    useEffect(() => {
        if (startedRef.current) return;
        startedRef.current = true;

        startGenerating();

        let mounted = true;

        const total = withJitter(MIN_LOAD_MS, JITTER_MS);
        const t1 = withJitter(Math.floor(total * 0.5), 300);
        const t2 = withJitter(Math.floor(total * 0.85), 300);

        const timers: number[] = [
            window.setTimeout(() => mounted && setActive(1), t1),
            window.setTimeout(() => mounted && setActive(2), t2),
        ];

        Promise.all([generateFromSample(refinements), sleep(total)])
            .then(([res]) => {
                if (!mounted) return;
                setParsed(res.parsed);
                setResult({ pdfUrl: res.pdfUrl });
                router.push('/preview');
            })
            .catch((err) => {
                if (!mounted) return;
                fail(err?.message || 'Generation failed. Please try again.');
            })
            .finally(() => {
                timers.forEach((t) => window.clearTimeout(t));
            });

        return () => {
            mounted = false;
            timers.forEach((t) => window.clearTimeout(t));
        };
    }, [startGenerating, refinements, setParsed, setResult, router, fail]);

    return (
        <LoadingIndicator
            title="Generating your GovStar resume…"
            steps={['Loading example data', 'Applying GovStar style', 'Rendering preview']}
            activeStep={active}
            showCancel
            onCancel={() => router.push('/')}
            size="lg"
        />
    );
}