export interface PromptEditorProps {
    label?: string;
    placeholder?: string;
    minRows?: number;
    maxChars?: number;
    disabled?: boolean;
    autoFocus?: boolean;
    helperText?: string;
    showPresets?: boolean;
    className?: string;
    onApply?: (value: string) => void;
}
