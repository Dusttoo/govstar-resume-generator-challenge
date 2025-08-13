import { fireEvent, render, screen } from '@testing-library/react';

jest.mock('pdfjs-dist/build/pdf.worker.min.mjs', () => 'worker-url', { virtual: true });

import PdfPreview from '@/components/PdfPreview/PdfPreview';

const SAMPLE_URL = '/samples/govstar-sample.pdf';

describe('PdfPreview', () => {
    it('renders a skeleton placeholder when no fileUrl is provided', () => {
        render(<PdfPreview fileUrl="" />);
        expect(screen.queryByTestId('pdf-document')).toBeNull();
    });

    it('renders a mocked Document/Page when fileUrl is provided', () => {
        render(<PdfPreview fileUrl={SAMPLE_URL} />);
        expect(screen.getByTestId('pdf-document')).toBeInTheDocument();
        expect(screen.getByText(/Page\s+1\s+\/\s+—/)).toBeInTheDocument();
    });

    it('supports zoom in and fit-to-width toggle (percentage text updates)', () => {
        render(<PdfPreview fileUrl={SAMPLE_URL} />);

        const percent = () => screen.getByText(/%$/);
        expect(percent().textContent).toBe('100%');

        const buttons = screen.getAllByRole('button');
        const zoomInBtn = buttons[5];
        const fitToggleBtn = buttons[6];

        fireEvent.click(zoomInBtn);
        expect(percent().textContent).toBe('110%');

        fireEvent.click(fitToggleBtn);
        expect(percent().textContent).toBe('100%');
    });

    it('opens in a new tab when the open button is clicked', () => {
        const openSpy = jest.spyOn(window, 'open').mockImplementation(() => null as any);
        render(<PdfPreview fileUrl={SAMPLE_URL} />);

        const buttons = screen.getAllByRole('button');
        const openBtn = buttons[7];

        fireEvent.click(openBtn);
        expect(openSpy).toHaveBeenCalledWith(SAMPLE_URL, '_blank', 'noopener,noreferrer');
        openSpy.mockRestore();
    });

    it('creates a temporary anchor and triggers download when Download is clicked', () => {
        const appendSpy = jest.spyOn(document.body, 'appendChild');
        const clickSpy = jest.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => { });
        const removeSpy = jest.spyOn(HTMLAnchorElement.prototype, 'remove').mockImplementation(() => { });

        render(<PdfPreview fileUrl={SAMPLE_URL} />);

        const buttons = screen.getAllByRole('button');
        const downloadBtn = buttons[8];

        fireEvent.click(downloadBtn);

        expect(appendSpy).toHaveBeenCalled();
        expect(clickSpy).toHaveBeenCalled();
        expect(removeSpy).toHaveBeenCalled();

        const appendedAnchor = appendSpy.mock.calls
            .map(call => call[0] as HTMLElement)
            .reverse()
            .find(el => el && el.tagName === 'A') as HTMLAnchorElement | undefined;

        expect(appendedAnchor).toBeTruthy();
        expect(appendedAnchor!.getAttribute('download')).toBe('resume.pdf');
        expect(appendedAnchor!.href).toContain(SAMPLE_URL);

        clickSpy.mockRestore();
        removeSpy.mockRestore();
        appendSpy.mockRestore();
    });
});
