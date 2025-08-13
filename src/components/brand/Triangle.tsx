import Box from "@mui/material/Box";
import { SxProps, Theme, keyframes } from "@mui/material/styles";

export type TriangleProps = {
    size?: number;
    colors: { outer: string; middle: string; inner: string };
    trace?: boolean;
    traceColor?: string;
    traceDurationMs?: number;
    className?: string;
};

const dash = keyframes`
  0%   { stroke-dashoffset: 0; }
  100% { stroke-dashoffset: -100; }
`;

const svgWrapSx = (): SxProps<Theme> => ({
    display: "inline-block",
    lineHeight: 0,
});


export default function Triangle({
    size = 160,
    colors,
    trace = true,
    traceColor,
    traceDurationMs = 2700,
    className,
}: TriangleProps) {
    return (
        <Box sx={svgWrapSx()} style={{ width: size, height: size }} className={className} aria-hidden>
            <svg viewBox="0 0 218 189" width="100%" height="100%" role="img" aria-label="GovStar triangle ornament">
                <polygon points="109 0 0 189 218 189 109 0" fill={colors.outer} />
                <path d="M109 30.1849L25.39 174.995H192.6L109 30.1849Z" fill={colors.middle} />
                <path d="M109 63.215L52.4 161.245H165.6L109 63.215Z" fill={colors.inner} />

                {trace && (
                    <g>
                        <Box
                            component="path"
                            d="M109 0 L0 189 L218 189 Z"
                            fill="none"
                            stroke={traceColor ?? colors.inner}
                            strokeWidth={2}
                            strokeLinecap="round"
                            pathLength={100}
                            sx={{
                                strokeDasharray: "33 67",
                                animation: `${dash} ${traceDurationMs}ms linear infinite`,
                                "@media (prefers-reduced-motion: reduce)": { animation: "none" },
                            }}
                        />
                    </g>
                )}
            </svg>
        </Box>
    );
}
