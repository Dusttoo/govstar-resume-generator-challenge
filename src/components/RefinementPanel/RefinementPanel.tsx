import AddIcon from '@mui/icons-material/Add';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Checkbox from '@mui/material/Checkbox';
import Chip from '@mui/material/Chip';
import Collapse from '@mui/material/Collapse';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import * as React from 'react';

import Button from '@/components/ui/Button/Button';
import useResumeStore from '@/store/resume.store';
import { actionsRowSx, panelSx, rowSx, twoColRowSx } from './RefinementPanel.styles';
import type { RefinementPanelProps, RefinementTone, RefinementValues } from './RefinementPanel.types';

const TONE_OPTIONS: { label: string; value: RefinementTone }[] = [
    { label: 'Concise', value: 'concise' },
    { label: 'Impactful', value: 'impactful' },
    { label: 'Formal', value: 'formal' },
    { label: 'Friendly', value: 'friendly' },
    { label: 'Technical', value: 'technical' },
];

function mergeValues(initial?: Partial<RefinementValues>): RefinementValues {
    return {
        prompt: initial?.prompt ?? '',
        targetRole: initial?.targetRole ?? '',
        targetCompany: initial?.targetCompany ?? '',
        tone: initial?.tone ?? 'concise',
        keywords: initial?.keywords ?? [],
        keepOriginalSummary: initial?.keepOriginalSummary ?? false,
        additionalNotes: initial?.additionalNotes ?? '',
    };
}

function buildRefinementText(v: RefinementValues): string {
    const lines: string[] = [];
    if (v.targetRole || v.targetCompany) {
        const parts = [v.targetRole && `Role: ${v.targetRole}`, v.targetCompany && `Company: ${v.targetCompany}`].filter(Boolean);
        if (parts.length) lines.push(parts.join(' | '));
    }
    if (v.tone) lines.push(`Tone: ${v.tone}.`);
    if (v.keywords.length) lines.push(`Emphasize: ${v.keywords.join(', ')}.`);
    if (v.keepOriginalSummary) lines.push('Preserve the original summary where possible.');
    if (v.additionalNotes.trim()) lines.push(v.additionalNotes.trim());
    return lines.join('\n');
}

export default function RefinementPanel({ initial, disabled = false, loading = false, onRegenerate, className }: RefinementPanelProps) {
    const [values, setValues] = React.useState<RefinementValues>(() => mergeValues(initial));
    const [kwInput, setKwInput] = React.useState('');
    const prompt = useResumeStore((s) => s.prompt);
    const startGenerating = useResumeStore((s) => s.startGenerating);

    function composeEffectivePrompt(basePrompt: string, v: RefinementValues): string {
        const cleanBase = (basePrompt || '').split('\n\nRefinements:')[0];
        const refinementsText = buildRefinementText(v);
        return cleanBase ? `${cleanBase}\n\nRefinements:\n${refinementsText}` : `Refinements:\n${refinementsText}`;
    }

    const [showOriginal, setShowOriginal] = React.useState(false);
    const [showEffective, setShowEffective] = React.useState(false);
    const effectivePrompt = React.useMemo(() => composeEffectivePrompt(prompt || '', values), [prompt, values]);

    const copyToClipboard = async (text: string) => {
        try { await navigator.clipboard.writeText(text); } catch { /* noop */ }
    };

    React.useEffect(() => {
        setValues((prev) => ({ ...prev, ...mergeValues(initial) }));
    }, [initial?.targetRole, initial?.targetCompany, initial?.tone, initial?.keepOriginalSummary, initial?.additionalNotes]);

    const addKeyword = () => {
        const raw = kwInput.trim();
        if (!raw) return;
        const parts = raw.split(',').map((p) => p.trim()).filter(Boolean);
        setValues((v) => ({ ...v, keywords: Array.from(new Set([...v.keywords, ...parts])) }));
        setKwInput('');
    };

    const removeKeyword = (k: string) => setValues((v) => ({ ...v, keywords: v.keywords.filter((x) => x.toLowerCase() !== k.toLowerCase()) }));
    const handleKwKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            addKeyword();
        }
    };

    const handlePrimary = () => {
        const composed = composeEffectivePrompt(prompt || '', values);
        onRegenerate?.(values, composed);
        startGenerating();
    };

    return (
        <Paper variant="outlined" className={className} sx={panelSx}>
            <Typography variant="h3">Refine</Typography>
            <Typography variant="body2" color="text.secondary">
                Tailor the generated resume by specifying a target role/company, tone, and key skills to emphasize.
            </Typography>
            {prompt ? (
                <Stack sx={{ mt: 1 }}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Typography variant="overline" color="text.secondary">Original instructions</Typography>
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <Tooltip title="Copy original">
                                <span>
                                    <IconButton size="small" onClick={() => copyToClipboard(prompt)}>
                                        <ContentCopyIcon fontSize="inherit" />
                                    </IconButton>
                                </span>
                            </Tooltip>
                            <Typography
                                variant="caption"
                                sx={{ cursor: 'pointer' }}
                                onClick={() => setShowOriginal((v) => !v)}
                            >
                                {showOriginal ? 'Hide' : 'Show'}
                            </Typography>
                        </Stack>
                    </Stack>
                    <Collapse in={showOriginal}>
                        <TextField value={prompt} multiline disabled fullWidth minRows={3} sx={{ mt: 1 }} />
                    </Collapse>
                </Stack>
            ) : null}


            <Stack sx={twoColRowSx}>
                <TextField
                    label="Target role"
                    placeholder="e.g., Senior Backend Engineer"
                    value={values.targetRole}
                    onChange={(e) => setValues((v) => ({ ...v, targetRole: e.target.value }))}
                    disabled={disabled}
                    fullWidth
                />
                <TextField
                    label="Target company"
                    placeholder="e.g., GovStar"
                    value={values.targetCompany}
                    onChange={(e) => setValues((v) => ({ ...v, targetCompany: e.target.value }))}
                    disabled={disabled}
                    fullWidth
                />
            </Stack>

            <Stack sx={twoColRowSx}>
                <TextField
                    select
                    label="Tone"
                    value={values.tone}
                    onChange={(e) => setValues((v) => ({ ...v, tone: e.target.value as RefinementTone }))}
                    disabled={disabled}
                    fullWidth
                >
                    {TONE_OPTIONS.map((o) => (
                        <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
                    ))}
                </TextField>
                <div />
            </Stack>

            <Stack sx={rowSx}>
                <TextField
                    label="Keywords / skills"
                    placeholder="Add a keyword and press Enter (e.g., Python, security clearance)"
                    value={kwInput}
                    onChange={(e) => setKwInput(e.target.value)}
                    onKeyDown={handleKwKeyDown}
                    disabled={disabled}
                    fullWidth
                    InputProps={{
                        endAdornment: (
                            <Tooltip title="Add">
                                <span>
                                    <IconButton onClick={addKeyword} size="small" disabled={!kwInput.trim() || disabled}>
                                        <AddIcon fontSize="small" />
                                    </IconButton>
                                </span>
                            </Tooltip>
                        ),
                    }}
                />
                <div style={{ minHeight: 8 }} />
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {values.keywords.map((k) => (
                        <Chip key={k} label={k} onDelete={() => removeKeyword(k)} />
                    ))}
                </div>
            </Stack>

            <FormControlLabel
                control={
                    <Checkbox
                        checked={values.keepOriginalSummary}
                        onChange={(e) => setValues((v) => ({ ...v, keepOriginalSummary: e.target.checked }))}
                        disabled={disabled}
                    />
                }
                label="Preserve original summary where possible"
            />

            <TextField
                label="Additional notes"
                placeholder="Any extra directions (e.g., prefer metrics, align bullets to USAJobs style, remove hobbies)."
                value={values.additionalNotes}
                onChange={(e) => setValues((v) => ({ ...v, additionalNotes: e.target.value }))}
                disabled={disabled}
                fullWidth
                minRows={4}
                multiline
            />

            <Divider sx={{ my: 1.5 }} />

            <Stack>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Typography variant="overline" color="text.secondary">Effective prompt (preview)</Typography>
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <Tooltip title="Copy effective prompt">
                            <span>
                                <IconButton size="small" onClick={() => copyToClipboard(effectivePrompt)}>
                                    <ContentCopyIcon fontSize="inherit" />
                                </IconButton>
                            </span>
                        </Tooltip>
                        <Typography
                            variant="caption"
                            sx={{ cursor: 'pointer' }}
                            onClick={() => setShowEffective((v) => !v)}
                        >
                            {showEffective ? 'Hide' : 'Show'}
                        </Typography>
                    </Stack>
                </Stack>
                <Collapse in={showEffective}>
                    <TextField value={effectivePrompt} multiline disabled fullWidth minRows={3} sx={{ mt: 1 }} />
                </Collapse>
            </Stack>

            <Stack sx={actionsRowSx}>
                <Button variant="contained" color="secondary" onClick={handlePrimary} loading={loading}>
                    Apply refinements & Regenerate
                </Button>
            </Stack>
        </Paper>
    );
}
