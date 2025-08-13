import { SxProps, Theme } from "@mui/material/styles";

export const wrapperSx: SxProps<Theme> = (theme) => ({
    display: "grid",
    gridTemplateRows: "auto 1fr",
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    overflow: "hidden",
    backgroundColor: theme.palette.background.paper,
});

export const toolbarSx: SxProps<Theme> = (theme) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.spacing(1),
    padding: theme.spacing(1),
    borderBottom: `1px solid ${theme.palette.divider}`,
});

export const controlsLeftSx: SxProps<Theme> = (theme) => ({
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(0.5),
});

export const controlsRightSx: SxProps<Theme> = (theme) => ({
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(0.5),
});

export const canvasAreaSx: SxProps<Theme> = (theme) => ({
    position: "relative",
    overflow: "auto",
    padding: theme.spacing(2),
    backgroundColor: theme.palette.grey[50],
});

export const pageFrameSx: SxProps<Theme> = (theme) => ({
    display: "grid",
    placeItems: "center",
});

export const pageSx: SxProps<Theme> = (theme) => ({
    boxShadow: theme.shadows[1],
    borderRadius: theme.shape.borderRadius,
});

export const errorBoxSx: SxProps<Theme> = (theme) => ({
    padding: theme.spacing(2),
    color: theme.palette.error.main,
});
