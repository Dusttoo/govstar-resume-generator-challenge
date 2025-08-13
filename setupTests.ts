import '@testing-library/jest-dom';

import 'whatwg-fetch';

jest.mock('next/router', () => require('next-router-mock'));

jest.mock('react-pdf', () => {
    const React = require('react');
    const Document = ({ children }: any) =>
        React.createElement('div', { 'data-testid': 'pdf-document' }, children);
    const Page = ({ pageNumber }: any) =>
        React.createElement('div', { 'data-testid': 'pdf-page' }, `Page ${pageNumber}`);
    return {
        __esModule: true,
        Document,
        Page,
        pdfjs: { GlobalWorkerOptions: { workerSrc: '' } },
    };
});


Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    })),
});

class MockResizeObserver {
    observe() { }
    unobserve() { }
    disconnect() { }
}
Object.defineProperty(window, 'ResizeObserver', {
    writable: true,
    value: MockResizeObserver,
});

if (!window.URL.createObjectURL) {
    // @ts-ignore
    window.URL.createObjectURL = () => 'blob:jest-mock';
}