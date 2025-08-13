export interface PdfPreviewProps {
    fileUrl: string;
    initialScale?: number;
    onLoad?: (numPages: number) => void;
    onError?: (error: Error) => void;
    className?: string;
}
