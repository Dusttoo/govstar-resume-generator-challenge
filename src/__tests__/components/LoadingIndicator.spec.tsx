import { fireEvent, render, screen } from '@testing-library/react';

import LoadingIndicator from '@/components/LoadingIndicator/LoadingIndicator';
import useMediaQuery from '@mui/material/useMediaQuery';

jest.mock('@/components/brand/Triangle', () => ({
    __esModule: true,
    default: (props: any) => (
        <div data-testid="triangle" data-props={JSON.stringify(props)} />
    ),
}));

jest.mock('@mui/material/useMediaQuery', () => jest.fn());

function getTriangleProps() {
    const el = screen.getByTestId('triangle');
    const json = el.getAttribute('data-props');
    return json ? JSON.parse(json) : {};
}

beforeEach(() => {
    jest.clearAllMocks();
    (useMediaQuery as jest.Mock).mockReturnValue(false);
    jest.useFakeTimers();
});

afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
});

describe('LoadingIndicator', () => {
    it('renders default title and steps', () => {
        render(<LoadingIndicator />);

        expect(
            screen.getByText('Generating your GovStar resume…')
        ).toBeInTheDocument();

        expect(screen.getByText('Parsing your PDF')).toBeInTheDocument();
        expect(screen.getByText('Applying GovStar style')).toBeInTheDocument();
        expect(screen.getByText('Rendering preview')).toBeInTheDocument();
    });

    it('shows Cancel button and calls onCancel', () => {
        const onCancel = jest.fn();
        render(<LoadingIndicator showCancel onCancel={onCancel} />);

        const btn = screen.getByRole('button', { name: /cancel/i });
        fireEvent.click(btn);
        expect(onCancel).toHaveBeenCalledTimes(1);
    });

    it('passes expected props to Triangle for default (md) size', () => {
        render(<LoadingIndicator />);
        const props = getTriangleProps();

        expect(props.size).toBe(160);

        expect(props.trace).toBe(true);

        expect(props.traceDurationMs).toBe(1800 * 3);

        expect(props.colors).toBeTruthy();
        expect(typeof props.colors).toBe('object');
    });

    it('maps size=lg and size=sm to Triangle sizes 200 and 120 respectively', () => {
        const { rerender } = render(<LoadingIndicator size="lg" />);
        expect(getTriangleProps().size).toBe(200);

        rerender(<LoadingIndicator size="sm" />);
        expect(getTriangleProps().size).toBe(120);
    });

    it('disables trace when prefers-reduced-motion is true', () => {
        (useMediaQuery as jest.Mock).mockReturnValue(true);
        render(<LoadingIndicator />);
        expect(getTriangleProps().trace).toBe(false);
    });

    it('sets up a word cycling interval when reduced motion is off and respects edgeDurationMs', () => {
        const setIntervalSpy = jest.spyOn(window, 'setInterval');

        render(<LoadingIndicator syncStepsWithWords edgeDurationMs={1000} />);

        expect(setIntervalSpy).toHaveBeenCalled();
        const lastCall = (setIntervalSpy as jest.Mock).mock.calls.pop();
        expect(lastCall?.[1]).toBe(1000);
    });

    it('does not set up a word cycling interval when prefers-reduced-motion is true', () => {
        const setIntervalSpy = jest.spyOn(window, 'setInterval');
        (useMediaQuery as jest.Mock).mockReturnValue(true);

        render(<LoadingIndicator syncStepsWithWords edgeDurationMs={1000} />);

        expect(setIntervalSpy).not.toHaveBeenCalled();
    });
});
