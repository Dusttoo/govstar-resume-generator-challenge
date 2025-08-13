

import { act, fireEvent, render, screen } from '@testing-library/react';
import Router from 'next-router-mock';

import GeneratePage from '@/pages/generate';

jest.mock('@/lib/generator', () => ({
    __esModule: true,
    generateFromSample: jest.fn(async () => ({
        parsed: { name: 'Sample User' } as any,
        pdfUrl: '/samples/govstar-sample.pdf',
    })),
}));

jest.mock('@/components/LoadingIndicator/LoadingIndicator', () => ({
    __esModule: true,
    default: ({ title, steps, activeStep, onCancel }: any) => (
        <div data-testid="loading">
            <div data-testid="title">{title}</div>
            <div data-testid="active-step">{activeStep}</div>
            <ul>
                {steps?.map((s: string, i: number) => (
                    <li key={i} data-testid={`step-${i}`}>{s}</li>
                ))}
            </ul>
            <button onClick={onCancel}>cancel</button>
        </div>
    ),
}));

const startGenerating = jest.fn();
const setResult = jest.fn();
const setParsed = jest.fn();
const fail = jest.fn();
const refinements = null;

jest.mock('@/store/resume.store', () => {
    const hook = (selector: any) => selector({
        startGenerating,
        setResult,
        setParsed,
        fail,
        refinements,
    });
    return { __esModule: true, default: hook };
});

beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
});

afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
});

describe('GeneratePage', () => {
    it('starts generation and routes to /preview after timers complete', async () => {
        render(<GeneratePage />);

        expect(startGenerating).toHaveBeenCalledTimes(1);

        await act(async () => {
            jest.runAllTimers();
        });

        expect(setParsed).toHaveBeenCalledWith(expect.objectContaining({ name: 'Sample User' }));
        expect(setResult).toHaveBeenCalledWith({ pdfUrl: '/samples/govstar-sample.pdf' });

        expect(Router).toMatchObject({ asPath: '/preview' });
    });

    it('cancel button routes back to /', async () => {
        render(<GeneratePage />);

        const btn = screen.getByText('cancel');
        fireEvent.click(btn);

        expect(Router).toMatchObject({ asPath: '/' });
    });
});