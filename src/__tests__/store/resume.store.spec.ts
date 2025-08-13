
import useResumeStore from '@/store/resume.store';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
if (!(URL as any).revokeObjectURL) {
    // @ts-ignore
    (URL as any).revokeObjectURL = () => { };
}

const getState = () => useResumeStore.getState();

let blobCounter = 0;
const createObjectURLSpy = jest
    .spyOn(URL, 'createObjectURL')
    .mockImplementation(() => `blob:mock-${++blobCounter}`);
const revokeObjectURLSpy = jest
    .spyOn(URL, 'revokeObjectURL')
    .mockImplementation(() => void 0);

function makeFile(name = 'resume.pdf', type = 'application/pdf') {
    return new File([new Uint8Array([1, 2, 3])], name, { type });
}

beforeEach(() => {
    jest.clearAllMocks();
    blobCounter = 0;
    try { window.sessionStorage.clear(); } catch { }
    getState().reset();
});

describe('resume.store', () => {
    test('initial state', () => {
        const s = getState();
        expect(s.file).toBeNull();
        expect(s.fileUrl).toBeNull();
        expect(s.prompt).toBe('');
        expect(s.status).toBe('idle');
        expect(s.result).toBeNull();
        expect(s.error).toBeNull();
        expect(s.parsed).toBeNull();
        expect(s.refinements).toBeNull();
    });

    test('setPrompt updates prompt', () => {
        getState().setPrompt('Turn this into a GovStar resume.');
        expect(getState().prompt).toBe('Turn this into a GovStar resume.');
    });

    test('startUploading / startGenerating set status and clear error', () => {
        getState().setError('whoops');
        getState().startUploading();
        expect(getState().status).toBe('uploading');
        expect(getState().error).toBeNull();

        getState().setError('bad');
        getState().startGenerating();
        expect(getState().status).toBe('generating');
        expect(getState().error).toBeNull();
    });

    test('setFile creates an object URL and clears derived state', () => {
        const f = makeFile();
        getState().setFile(f);

        const s = getState();
        expect(createObjectURLSpy).toHaveBeenCalledTimes(1);
        expect(s.file).toBe(f);
        expect(s.fileUrl).toMatch(/^blob:mock-1$/);
        expect(s.result).toBeNull();
        expect(s.parsed).toBeNull();
        expect(s.status).toBe('idle');
        expect(s.error).toBeNull();
        expect(revokeObjectURLSpy).not.toHaveBeenCalled();
    });

    test('replaceFile revokes previous fileUrl and result pdfUrl, sets new url, clears result/parsed', () => {
        const f1 = makeFile('one.pdf');
        getState().setFile(f1);
        getState().setResult({ pdfUrl: 'blob:prev-result', meta: { m: 1 } });

        const f2 = makeFile('two.pdf');
        getState().replaceFile(f2);

        const s = getState();
        expect(createObjectURLSpy).toHaveBeenCalledTimes(2);
        expect(revokeObjectURLSpy).toHaveBeenCalledWith('blob:mock-1');
        expect(revokeObjectURLSpy).toHaveBeenCalledWith('blob:prev-result');
        expect(s.file).toBe(f2);
        expect(s.fileUrl).toMatch(/^blob:mock-2$/);
        expect(s.result).toBeNull();
        expect(s.parsed).toBeNull();
        expect(s.status).toBe('idle');
    });

    test('clearFile revokes fileUrl and clears file/fileUrl only', () => {
        const f = makeFile();
        getState().setFile(f);

        getState().clearFile();
        const s = getState();

        expect(revokeObjectURLSpy).toHaveBeenCalledWith('blob:mock-1');
        expect(s.file).toBeNull();
        expect(s.fileUrl).toBeNull();
    });

    test('setResult sets status=ready and revokes previous result url when replaced', () => {
        getState().setResult({ pdfUrl: 'blob:r1' });
        expect(getState().status).toBe('ready');
        expect(getState().result?.pdfUrl).toBe('blob:r1');

        getState().setResult({ pdfUrl: 'blob:r2' });
        expect(revokeObjectURLSpy).toHaveBeenCalledWith('blob:r1');
        expect(getState().result?.pdfUrl).toBe('blob:r2');
    });

    test('fail sets status=error and error message; setError updates error only', () => {
        getState().fail('parse failed');
        expect(getState().status).toBe('error');
        expect(getState().error).toBe('parse failed');

        getState().setError(null);
        expect(getState().status).toBe('error');
        expect(getState().error).toBeNull();
    });

    test('setParsed and setRefinements update slices', () => {
        getState().setParsed({ name: 'Jordan' });
        getState().setRefinements({ tone: 'concise', keywords: ['TypeScript'] });

        expect(getState().parsed).toEqual({ name: 'Jordan' });
        expect(getState().refinements).toEqual({ tone: 'concise', keywords: ['TypeScript'] });
    });

    test('reset clears file/fileUrl/prompt/result/error/parsed/refinements and revokes urls', () => {
        const f = makeFile();
        getState().setFile(f);
        getState().setPrompt('hello');
        getState().setResult({ pdfUrl: 'blob:result-1' });
        getState().setParsed({ name: 'A' });
        getState().setRefinements({ tone: 'formal' });

        getState().reset();

        const s = getState();
        expect(revokeObjectURLSpy).toHaveBeenCalledWith('blob:mock-1');
        expect(revokeObjectURLSpy).toHaveBeenCalledWith('blob:result-1');

        expect(s.file).toBeNull();
        expect(s.fileUrl).toBeNull();
        expect(s.prompt).toBe('');
        expect(s.status).toBe('idle');
        expect(s.result).toBeNull();
        expect(s.error).toBeNull();
        expect(s.parsed).toBeNull();
        expect(s.refinements).toBeNull();
    });
});
