import { alpha, createTheme } from "@mui/material/styles";

const brand = {
    antiqueWhite: "#e7ddd0",
    brown: "#262525",
    tomato: "#ef5937",
    steelBlue: "#198daa",
};

const paper = "#2b2a2a";

const headingFontStack = [
    "Oswald",
    "Roboto Condensed",
    "Arial Narrow",
    "Arial",
    "sans-serif",
].join(", ");

const bodyFontStack = [
    "Roboto",
    "Inter",
    "system-ui",
    "-apple-system",
    "Segoe UI",
    "Helvetica",
    "Arial",
    "sans-serif",
    "Apple Color Emoji",
    "Segoe UI Emoji",
].join(", ");

const textPrimary = brand.antiqueWhite;
const textSecondary = alpha(brand.antiqueWhite, 0.72);
const divider = alpha(brand.antiqueWhite, 0.12);

const theme = createTheme({
    palette: {
        mode: "dark",
        primary: {
            main: brand.steelBlue,
            contrastText: "#ffffff",
        },
        secondary: {
            main: brand.tomato,
            contrastText: "#ffffff",
        },
        background: {
            default: brand.brown,
            paper,
        },
        text: {
            primary: textPrimary,
            secondary: textSecondary,
        },
        divider,
    },
    shape: {
        borderRadius: 3,
    },
    typography: {
        fontFamily: bodyFontStack,
        h1: {
            fontFamily: headingFontStack,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.04em",
            lineHeight: 1.1,
            fontSize: "clamp(2.25rem, 3.5vw, 3.25rem)",
        },
        h2: {
            fontFamily: headingFontStack,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.035em",
            lineHeight: 1.15,
            fontSize: "clamp(1.75rem, 2.8vw, 2.5rem)",
        },
        h3: {
            fontFamily: headingFontStack,
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.03em",
            lineHeight: 1.2,
            fontSize: "clamp(1.5rem, 2.2vw, 2rem)",
        },
        h4: {
            fontFamily: headingFontStack,
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.02em",
        },
        subtitle1: {
            fontFamily: headingFontStack,
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
        },
        body1: {
            fontWeight: 400,
            lineHeight: 1.65,
        },
        body2: {
            fontWeight: 400,
            lineHeight: 1.55,
        },
        button: {
            fontFamily: headingFontStack,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
        },
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    backgroundColor: brand.brown,
                    color: textPrimary,
                    WebkitFontSmoothing: "antialiased",
                    MozOsxFontSmoothing: "grayscale",
                },
                "::selection": {
                    backgroundColor: alpha(brand.steelBlue, 0.35),
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: brand.brown,
                    color: textPrimary,
                    borderBottom: `1px solid ${divider}`,
                    boxShadow: "none",
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: "none",
                    backgroundColor: paper,
                    color: textPrimary,
                    border: `1px solid ${divider}`,
                },
            },
        },
        MuiButton: {
            defaultProps: {
                disableElevation: true,
            },
            styleOverrides: {
                root: {
                    borderRadius: 10,
                    "&:focus-visible": {
                        outline: `3px solid ${alpha(brand.steelBlue, 0.6)}`,
                        outlineOffset: 2,
                    },
                },
                containedSecondary: {
                    color: "#ffffff",
                },
            },
        },
        MuiLink: {
            styleOverrides: {
                root: {
                    color: brand.steelBlue,
                    textUnderlineOffset: 4,
                    "&:hover": { textDecoration: "underline" },
                },
            },
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: alpha(textPrimary, 0.2),
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: alpha(textPrimary, 0.35),
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: brand.steelBlue,
                    },
                },
            },
        },
        MuiDivider: {
            styleOverrides: {
                root: {
                    borderColor: divider,
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                filledPrimary: {
                    color: "#fff",
                },
                filledSecondary: {
                    color: "#fff",
                },
            },
        },
    },
});

export default theme;
