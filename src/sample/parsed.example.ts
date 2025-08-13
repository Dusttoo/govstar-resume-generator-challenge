import type { ParsedResume } from '@/store/resume.store';

export const SAMPLE_PARSED: ParsedResume = {
    name: 'Jordan Taylor',
    title: 'Senior Software Engineer',
    email: 'jordan.taylor@email.com',
    phone: '(555) 123-4567',
    location: 'Austin, TX',
    links: [
        { label: 'LinkedIn', url: 'https://www.linkedin.com/in/jordantaylor' },
        { label: 'GitHub', url: 'https://github.com/jtay' },
    ],
    summary:
        'Senior engineer with 7+ years building high-impact web apps. Focused on TypeScript, React, and scalable APIs; passionate about elegant DX and measurable outcomes.',
    skills: [
        'TypeScript', 'React', 'Next.js', 'Node.js', 'GraphQL', 'AWS',
        'PostgreSQL', 'Docker', 'CI/CD', 'Testing', 'Jest', 'Playwright'
    ],
    experience: [
        {
            company: 'Acme Corp',
            role: 'Senior Software Engineer',
            range: '2021–Present',
            location: 'Remote',
            bullets: [
                'Led migration to TypeScript across 20+ services, cutting runtime errors by 35%.',
                'Shipped design-system components in React/MUI, reducing feature build time by ~25%.',
                'Designed GraphQL gateway with caching that improved p95 latency from 680ms → 230ms.',
                'Mentored 4 engineers; instituted PR guidelines and CI quality gates.'
            ],
        },
        {
            company: 'Widget Co',
            role: 'Software Engineer',
            range: '2018–2021',
            location: 'Austin, TX',
            bullets: [
                'Built customer onboarding flow (Next.js), improving conversion by 14%.',
                'Implemented Postgres partitioning and indexes; 4× faster reporting queries.',
                'Containerized legacy services and standardized local dev with Docker Compose.',
                'Owned test strategy (Jest/Playwright) increasing coverage from 42% → 78%.'
            ],
        },
    ],
    education: { school: 'University of Texas at Austin', degree: 'B.S. Computer Science', year: '2018' },
    isScanned: false,
};