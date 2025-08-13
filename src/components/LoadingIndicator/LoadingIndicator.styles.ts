import { alpha, keyframes, SxProps, Theme } from "@mui/material/styles";

export type LoadingSize = "sm" | "md" | "lg";

export const containerSx = (size: LoadingSize = "md"): SxProps<Theme> => (theme) => {
    const heights: Record<LoadingSize, number> = { sm: 120, md: 180, lg: 220 };
    return {
        position: "relative",
        height: heights[size],
        width: "100%",
        borderRadius: theme.shape.borderRadius,
        overflow: "hidden",
        border: `1px solid ${theme.palette.divider}`,
        backgroundColor: theme.palette.primary.main,
    };
};

const stripes = (theme: Theme) =>
    `repeating-linear-gradient(25deg, ${theme.palette.secondary.main} 0 10px, ${theme.palette.text.primary} 10px 20px)`;

const waveSlow = keyframes`
  0% { background-position: 0 0; }
  100% { background-position: 160px 0; }
`;
const waveMed = keyframes`
  0% { background-position: 0 0; }
  100% { background-position: 220px 0; }
`;
const waveFast = keyframes`
  0% { background-position: 0 0; }
  100% { background-position: 300px 0; }
`;

export const stripeLayerSx = (layer: 1 | 2 | 3): SxProps<Theme> => (theme) => {
    const durations: Record<1 | 2 | 3, string> = {
        1: "12s",
        2: "9s",
        3: "6s",
    };
    const animations: Record<1 | 2 | 3, string> = {
        1: `${waveSlow} ${durations[1]} linear infinite`,
        2: `${waveMed} ${durations[2]} linear infinite`,
        3: `${waveFast} ${durations[3]} linear infinite`,
    } as const;

    return {
        position: "absolute",
        inset: -20,
        transform: "rotate(-8deg)",
        backgroundImage: stripes(theme),
        backgroundSize: "280px 280px",
        opacity: layer === 1 ? 0.28 : layer === 2 ? 0.42 : 0.6,
        filter: layer === 1 ? "blur(2px)" : layer === 2 ? "blur(1px)" : "none",
        animation: animations[layer],
        ["@media (prefers-reduced-motion: reduce)"]: {
            animation: "none",
        },
    };
};

export const vignetteSx: SxProps<Theme> = (theme) => ({
    pointerEvents: "none",
    position: "absolute",
    inset: 0,
    background: `linear-gradient(180deg, ${alpha(theme.palette.primary.dark, 0.0)} 0%, ${alpha(
        theme.palette.primary.dark,
        0.18
    )} 100%)`,
});

export const starSx = (size: LoadingSize = "md"): SxProps<Theme> => (theme) => {
    const dims: Record<LoadingSize, number> = { sm: 40, md: 56, lg: 72 };
    const pulse = keyframes`
    0% { transform: translate(-50%, -50%) scale(0.96); opacity: .92; }
    50% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
    100% { transform: translate(-50%, -50%) scale(0.96); opacity: .92; }
  `;
    return {
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
        width: dims[size],
        height: dims[size],
        animation: `${pulse} 2500ms ease-in-out infinite`,
        ["@media (prefers-reduced-motion: reduce)"]: {
            animation: "none",
        },
    };
};

export const copyWrapSx: SxProps<Theme> = (theme) => ({
    textAlign: "center",
});

export const stepsWrapSx: SxProps<Theme> = (theme) => ({
    display: "grid",
    gap: theme.spacing(0.5),
});

export const stepItemSx = (active: boolean): SxProps<Theme> => (theme) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing(1),
    color: active ? theme.palette.text.primary : alpha(theme.palette.text.primary, 0.7),
    fontWeight: active ? 600 : 400,
});

export const actionsRowSx: SxProps<Theme> = (theme) => ({
    display: "flex",
    justifyContent: "center",
    gap: theme.spacing(1),
});

export const triangleWrapSx: SxProps<Theme> = (theme) => ({
    display: "grid",
    placeItems: "center",
    padding: theme.spacing(4),
    borderRadius: theme.shape.borderRadius,
    border: `1px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.background.paper,
});

export const triWordsRowSx: SxProps<Theme> = (theme) => ({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: theme.spacing(2),
    letterSpacing: "0.06em",
    textTransform: "uppercase",
});

export const triWordItemSx = (index: number, activeIndex: number): SxProps<Theme> => (theme) => ({
    fontWeight: 700,
    transition: theme.transitions.create(["opacity", "transform"], { duration: theme.transitions.duration.shorter }),
    opacity: index === activeIndex ? 1 : 0.45,
    transform: index === activeIndex ? "translateY(0)" : "translateY(2px)",
    color: index === 0 ? theme.palette.secondary.main : index === 1 ? theme.palette.text.primary : theme.palette.primary.main,
});
