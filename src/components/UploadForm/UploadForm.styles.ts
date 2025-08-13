import { SxProps, Theme } from "@mui/material/styles";

export const dropAreaSx = (
    state: { isDragActive: boolean; isDragAccept: boolean; isDragReject: boolean; disabled?: boolean }
): SxProps<Theme> => (theme) => {
    const baseBorder = `2px dashed ${theme.palette.divider}`;
    const acceptBorder = `2px dashed ${theme.palette.primary.main}`;
    const rejectBorder = `2px dashed ${theme.palette.error.main}`;

    return {
        cursor: state.disabled ? "not-allowed" : "pointer",
        border: baseBorder,
        borderRadius: theme.shape.borderRadius,
        padding: theme.spacing(4),
        outline: "none",
        minHeight: 395,
        transition: theme.transitions.create(["border-color", "background-color"], {
            duration: theme.transitions.duration.shorter,
        }),
        ...(state.isDragActive && { border: acceptBorder, backgroundColor: theme.palette.action.hover }),
        ...(state.isDragAccept && { border: acceptBorder, backgroundColor: theme.palette.action.focus }),
        ...(state.isDragReject && { border: rejectBorder, backgroundColor: theme.palette.action.selected }),
        ...(state.disabled && { opacity: 0.6 }),
    };
};

export const helperTextSx: SxProps<Theme> = (theme) => ({
    color: theme.palette.text.secondary,
    marginTop: theme.spacing(1),
});

export const fileInfoRowSx: SxProps<Theme> = (theme) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.spacing(2),
    padding: theme.spacing(1.5, 2),
    borderRadius: theme.shape.borderRadius,
    border: `1px solid ${theme.palette.divider}`,
});
