import {
    Document,
    Font,
    Page,
    Path,
    StyleSheet,
    Svg,
    Text,
    View,
} from '@react-pdf/renderer';
import * as React from 'react';


const COLORS = {
    primary: '#198daa',   // steel blue
    secondary: '#ef5937', // tomato
    antique: '#e7ddd0',   // antique white
    ink: '#262525',       // brown / body text
    lightInk: '#4a4949',
};

const SP = 8;


Font.register({
    family: 'WorkSans',
    fonts: [
        { src: '/fonts/WorkSans-Regular.ttf' },
        { src: '/fonts/WorkSans-SemiBold.ttf', fontWeight: 600 },
        { src: '/fonts/WorkSans-Bold.ttf', fontWeight: 700 },
    ],
});

Font.registerHyphenationCallback((word) => [word]);

export type ResumeDocProps = {
    parsed: {
        name?: string;
        title?: string;
        email?: string;
        phone?: string;
        links?: { label: string; url: string }[];
        location?: string;
        skills?: string[];
        summary?: string;
        bullets?: string[];
        experience?: Array<{
            company: string;
            role: string;
            range?: string;
            location?: string;
            bullets: string[];
        }>;
        education?: { school: string; degree?: string; year?: string };
    };
    refinements?: {
        tone?: 'concise' | 'impactful' | 'formal' | 'friendly' | 'technical';
        keywords?: string[];
        keepOriginalSummary?: boolean;
        targetRole?: string;
        targetCompany?: string;
        additionalNotes?: string;
    };
};


const truncate = (s: string, n = 150) => (s && s.length > n ? s.slice(0, Math.max(0, n - 1)) + '…' : s);

function normalizeKeywords(keys?: string[]) {
    return (keys ?? []).map((k) => k.trim()).filter(Boolean).map((k) => k.toLowerCase());
}

function Emphasized({ text, keywords }: { text: string; keywords?: string[] }) {
    const lows = normalizeKeywords(keywords);
    if (!text) return null as any;
    if (!lows.length) return <Text>{text}</Text>;

    const parts: Array<{ t: string; hit: boolean }> = [];
    let remaining = text;
    while (remaining.length) {
        let bestIdx = -1;
        let bestKey = '';
        for (const k of lows) {
            const idx = remaining.toLowerCase().indexOf(k);
            if (idx !== -1 && (bestIdx === -1 || idx < bestIdx)) {
                bestIdx = idx;
                bestKey = k;
            }
        }
        if (bestIdx === -1) {
            parts.push({ t: remaining, hit: false });
            break;
        }
        if (bestIdx > 0) parts.push({ t: remaining.slice(0, bestIdx), hit: false });
        parts.push({ t: remaining.slice(bestIdx, bestIdx + bestKey.length), hit: true });
        remaining = remaining.slice(bestIdx + bestKey.length);
    }

    return (
        <Text>
            {parts.map((p, i) => (
                <Text key={i} style={p.hit ? styles.emph : undefined}>
                    {p.t}
                </Text>
            ))}
        </Text>
    );
}

function synthesizeSummary(parsed: ResumeDocProps['parsed'], r?: ResumeDocProps['refinements']) {
    if (r?.keepOriginalSummary && parsed.summary) return parsed.summary;
    if (parsed.summary) return parsed.summary;
    const role = r?.targetRole || parsed.title || 'Professional';
    const pieces = [
        `Results-driven ${role}`,
        parsed.skills?.length ? `skilled in ${parsed.skills.slice(0, 5).join(', ')}` : undefined,
        r?.targetCompany ? `tailored for ${r.targetCompany}` : undefined,
    ].filter(Boolean);
    return pieces.join(' · ') + '.';
}

function bulletsForTone(bullets: string[] = [], tone?: ResumeDocProps['refinements'] extends infer T ? T extends { tone?: infer U } ? U : never : never) {
    const max = tone === 'concise' ? 3 : 4;
    return bullets.slice(0, max).map((b) => truncate(b, 180) || '').filter(Boolean) as string[];
}


const styles = StyleSheet.create({
    page: {
        fontFamily: 'WorkSans',
        color: COLORS.ink,
        fontSize: 10.5,
        padding: SP * 5,
        lineHeight: 1.35,
    },
    headerBand: {
        backgroundColor: COLORS.primary,
        borderRadius: 6,
        padding: SP * 2,
        paddingRight: SP * 3,
        paddingLeft: SP * 3,
        color: '#fff',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    headLeft: { flexDirection: 'row', alignItems: 'center', gap: SP },
    headRight: { textAlign: 'right' as const },
    name: { fontSize: 22, fontWeight: 700, color: '#fff' },
    title: { fontSize: 12, fontWeight: 600, color: '#fff', marginTop: 2 },

    contact: { marginTop: SP * 1.25, flexDirection: 'row', flexWrap: 'wrap' as const, gap: SP },
    contactItem: { fontSize: 9.5, color: COLORS.lightInk },

    section: { marginTop: SP * 3 },
    sectionTitleRow: { flexDirection: 'row', alignItems: 'center', gap: SP },
    sectionTitle: { fontSize: 12.5, fontWeight: 700 },
    underline: { height: 2, backgroundColor: COLORS.secondary, flexGrow: 1 },

    paragraph: { marginTop: SP, fontSize: 10.5 },
    emph: { color: COLORS.secondary, fontWeight: 600 },

    skillsLine: { marginTop: SP, flexDirection: 'row', flexWrap: 'wrap' as const, gap: 6 },
    skillChip: {
        fontSize: 9.5,
        paddingVertical: 2,
        paddingHorizontal: 6,
        borderRadius: 3,
        backgroundColor: COLORS.antique,
        color: COLORS.ink,
    },

    experienceItem: { marginTop: SP * 2 },
    expHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
    expLeft: { flexDirection: 'column' },
    company: { fontSize: 11.5, fontWeight: 700 },
    role: { fontSize: 10.5, color: COLORS.lightInk },
    expMeta: { fontSize: 9.5, color: COLORS.lightInk },
    bullets: { marginTop: SP, paddingLeft: SP * 1.5 },
    bulletRow: { flexDirection: 'row', marginBottom: 4 },
    bulletDot: { width: 6, color: COLORS.secondary, marginRight: 6 },
    bulletText: { flex: 1, fontSize: 10.5 },

    educationRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: SP },
});


function SectionTitle({ children }: { children: React.ReactNode }) {
    return (
        <View style={styles.sectionTitleRow}>
            <Text style={styles.sectionTitle}>{children}</Text>
            <View style={styles.underline} />
        </View>
    );
}

function BrandTriangle({ size = 18 }: { size?: number }) {
    const w = size;
    const h = Math.round((size * 189) / 218);
    return (
        <Svg width={w} height={h} viewBox="0 0 218 189">
            <Path d="M109 0 0 189 218 189Z" fill={COLORS.secondary} />
            <Path d="M109 30.1849 25.39 174.995 192.6 174.995Z" fill={COLORS.primary} />
            <Path d="M109 63.215 52.4 161.245 165.6 161.245Z" fill={COLORS.antique} />
        </Svg>
    );
}


export default function ResumeDoc({ parsed, refinements }: ResumeDocProps) {
    const keywords = normalizeKeywords(refinements?.keywords);

    const summary = synthesizeSummary(parsed, refinements);

    const skills = [...(parsed.skills ?? [])];
    if (keywords.length && skills.length) {
        skills.sort((a, b) => {
            const A = keywords.includes(a.toLowerCase()) ? 0 : 1;
            const B = keywords.includes(b.toLowerCase()) ? 0 : 1;
            return A - B;
        });
    }

    const exp = (parsed.experience ?? []).slice(0, 2).map((e) => ({
        ...e,
        bullets: bulletsForTone(e.bullets, refinements?.tone),
    }));

    return (
        <Document title={parsed.name ? `${parsed.name} — Resume` : 'Resume'} author={parsed.name || undefined}>
            <Page size="LETTER" style={styles.page}>
                {/* Header band */}
                <View style={styles.headerBand}>
                    <View style={styles.headLeft}>
                        <BrandTriangle size={22} />
                    </View>
                    <View style={styles.headRight}>
                        <Text style={styles.name}>{parsed.name || 'Your Name'}</Text>
                        <Text style={styles.title}>{parsed.title || refinements?.targetRole || 'Professional Title'}</Text>
                    </View>
                </View>

                <View style={styles.contact}>
                    {parsed.email ? <Text style={styles.contactItem}>{parsed.email}</Text> : null}
                    {parsed.phone ? <Text style={styles.contactItem}>• {parsed.phone}</Text> : null}
                    {parsed.location ? <Text style={styles.contactItem}>• {parsed.location}</Text> : null}
                    {(parsed.links ?? []).map((l, i) => (
                        <Text key={i} style={styles.contactItem}>• {l.label}: {l.url}</Text>
                    ))}
                </View>

                <View style={styles.section}>
                    <SectionTitle>Summary</SectionTitle>
                    <Text style={styles.paragraph}>
                        <Emphasized text={summary} keywords={keywords} />
                    </Text>
                </View>

                {/* Skills */}
                {!!skills.length && (
                    <View style={styles.section}>
                        <SectionTitle>Skills</SectionTitle>
                        <View style={styles.skillsLine}>
                            {skills.slice(0, 20).map((s, i) => (
                                <Text key={i} style={styles.skillChip}>
                                    <Emphasized text={s} keywords={keywords} />
                                </Text>
                            ))}
                        </View>
                    </View>
                )}

                {!!exp.length && (
                    <View style={styles.section}>
                        <SectionTitle>Experience</SectionTitle>
                        {exp.map((e, idx) => (
                            <View key={idx} style={styles.experienceItem} wrap>
                                <View style={styles.expHeader}>
                                    <View style={styles.expLeft}>
                                        <Text style={styles.company}>{e.company || 'Company'}</Text>
                                        <Text style={styles.role}>{e.role || 'Role'}</Text>
                                    </View>
                                    <View>
                                        <Text style={styles.expMeta}>
                                            {[e.location, e.range].filter(Boolean).join(' · ') || 'Location · Dates'}
                                        </Text>
                                    </View>
                                </View>
                                <View style={styles.bullets}>
                                    {e.bullets.map((b, i) => (
                                        <View key={i} style={styles.bulletRow}>
                                            <Text style={styles.bulletDot}>•</Text>
                                            <Text style={styles.bulletText}>
                                                <Emphasized text={b} keywords={keywords} />
                                            </Text>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        ))}
                    </View>
                )}

                {parsed.education && (
                    <View style={styles.section}>
                        <SectionTitle>Education</SectionTitle>
                        <View style={styles.educationRow}>
                            <Text>{parsed.education.school}</Text>
                            <Text>{[parsed.education.degree, parsed.education.year].filter(Boolean).join(' · ')}</Text>
                        </View>
                    </View>
                )}
            </Page>
        </Document>
    );
}
