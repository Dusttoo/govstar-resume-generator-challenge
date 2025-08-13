import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import RefinementPanel from '@/components/RefinementPanel/RefinementPanel';

const startGenerating = jest.fn();
let mockPrompt = 'Analyze and standardize resume to GovStar style.';

jest.mock('@/store/resume.store', () => {
    return {
        __esModule: true,
        default: (selector: any) => selector({
            prompt: mockPrompt,
            startGenerating,
        }),
    };
});

function typeByLabel(label: string, value: string) {
    const input = screen.getByLabelText(label) as HTMLInputElement;
    fireEvent.change(input, { target: { value } });
    return input;
}

describe('RefinementPanel', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockPrompt = 'Analyze and standardize resume to GovStar style.';
    });

    it('composes an idempotent effective prompt and triggers regeneration', async () => {
        mockPrompt = 'BASE\n\nRefinements:\nOld line that should be replaced';

        const onRegenerate = jest.fn();
        render(<RefinementPanel onRegenerate={onRegenerate} />);

        typeByLabel('Target role', 'Senior Backend Engineer');
        typeByLabel('Target company', 'GovStar');

        const toneButton = screen.getByRole('combobox', { name: /Tone/i });
        await userEvent.click(toneButton);
        const friendlyOption = await screen.findByRole('option', { name: /Friendly/i });
        await userEvent.click(friendlyOption);

        const kw = screen.getByLabelText(/Keywords \/ skills/i) as HTMLInputElement;
        screen.debug(kw);
        await userEvent.type(kw, 'Python, security clearance{enter}');

        const preserve = screen.getByLabelText(/Preserve original summary/i) as HTMLInputElement;
        fireEvent.click(preserve);

        typeByLabel('Additional notes', 'Prefer metrics.');

        const btn = screen.getByRole('button', { name: /Apply refinements & Regenerate/i });
        fireEvent.click(btn);

        expect(startGenerating).toHaveBeenCalled();

        expect(onRegenerate).toHaveBeenCalledTimes(1);
        const [values, composed] = onRegenerate.mock.calls[0];

        expect(values).toMatchObject({
            targetRole: 'Senior Backend Engineer',
            targetCompany: 'GovStar',
            tone: 'friendly',
            keywords: ['Python', 'security clearance'],
            keepOriginalSummary: true,
            additionalNotes: 'Prefer metrics.',
        });

        expect(composed.startsWith('BASE\n\nRefinements:\n')).toBe(true);
        expect(composed).toContain('Role: Senior Backend Engineer | Company: GovStar');
        expect(composed).toContain('Tone: friendly.');
        expect(composed).toContain('Emphasize: Python, security clearance.');
        expect(composed).toContain('Preserve the original summary where possible.');
        expect(composed).toContain('Prefer metrics.');
        expect(composed).not.toContain('Old line that should be replaced');

        const refinementsCount = (composed.match(/\n\nRefinements:/g) || []).length;
        expect(refinementsCount).toBe(1);
    });

    it('disables inputs when disabled=true', () => {
        render(<RefinementPanel disabled />);

        expect(screen.getByLabelText('Target role')).toBeDisabled();
        expect(screen.getByLabelText('Target company')).toBeDisabled();
        const addButtons = screen.getAllByRole('button');
        expect(addButtons.length).toBeGreaterThan(0);
    });
});
