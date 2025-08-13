import ResumeDoc from '@/pdf/ResumeDoc';
import { SAMPLE_PARSED } from '@/sample/parsed.example';
import type { ParsedResume, Refinements } from '@/store/resume.store';
import type { DocumentProps } from '@react-pdf/renderer';
import { pdf } from '@react-pdf/renderer';
import * as React from 'react';

export const STATIC_SAMPLE_URL = '/samples/govstar-sample.pdf';

export async function renderResumeBlobUrl(parsed: ParsedResume, refinements?: Refinements | null): Promise<string> {
    const element = React.createElement(
        ResumeDoc as React.ComponentType<any>,
        { parsed, refinements: refinements ?? undefined }
    ) as React.ReactElement<DocumentProps>;
    const blob = await pdf(element).toBlob();
    return URL.createObjectURL(blob);
}

export async function generateFromSample(refinements?: Refinements | null): Promise<{ pdfUrl: string; parsed: ParsedResume }> {
    return { pdfUrl: STATIC_SAMPLE_URL, parsed: SAMPLE_PARSED };
}