import { SxProps, Theme } from "@mui/material/styles";

export const fieldSx: SxProps<Theme> = (theme) => ({
    "& .MuiInputBase-root": {
        alignItems: "flex-start",
    },
});

export const counterRowSx: SxProps<Theme> = (theme) => ({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: theme.spacing(1),
    color: theme.palette.text.secondary,
});

export const presetsRowSx: SxProps<Theme> = (theme) => ({
    display: "flex",
    flexWrap: "wrap",
    gap: theme.spacing(1),
});
