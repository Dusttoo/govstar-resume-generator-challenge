export type RefinementTone = 'concise' | 'impactful' | 'formal' | 'friendly' | 'technical';

export interface RefinementValues {
    prompt: string;
    targetRole?: string;
    targetCompany?: string;
    tone?: RefinementTone;
    keywords: string[];
    keepOriginalSummary: boolean;
    additionalNotes: string;
}

export interface RefinementPanelProps {
    initial?: Partial<RefinementValues>;
    disabled?: boolean;
    loading?: boolean;
    onRegenerate?: (values: RefinementValues, composedPrompt: string) => void;
    className?: string;
}
