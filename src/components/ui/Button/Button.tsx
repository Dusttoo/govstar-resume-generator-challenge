import Box from "@mui/material/Box";
import ButtonBase, { ButtonProps as MuiButtonProps } from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import * as React from "react";

export interface ButtonProps extends MuiButtonProps {
    loading?: boolean;
    loadingPosition?: "start" | "end" | "center";
}

const LoadingSpinner = ({ size = 18 }: { size?: number }) => (
    <CircularProgress size={size} thickness={5} aria-label="loading" />
);

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
    { loading = false, loadingPosition = "center", disabled, children, startIcon, endIcon, ...props },
    ref
) {
    const isDisabled = disabled || loading;

    const content = (
        <>
            {loading && loadingPosition === "start" ? (
                <Box component="span" sx={{ mr: 1, display: "inline-flex" }}>
                    <LoadingSpinner />
                </Box>
            ) : (
                startIcon
            )}

            <Box component="span" sx={{ display: "inline-flex", alignItems: "center", gap: 1 }}>
                {children}
            </Box>

            {loading && loadingPosition === "end" ? (
                <Box component="span" sx={{ ml: 1, display: "inline-flex" }}>
                    <LoadingSpinner />
                </Box>
            ) : (
                endIcon
            )}
        </>
    );

    return (
        <Box position="relative" display="inline-flex">
            <ButtonBase ref={ref} disabled={isDisabled} {...props} startIcon={undefined} endIcon={undefined}>
                {content}
            </ButtonBase>
            {loading && loadingPosition === "center" && (
                <Box
                    aria-hidden
                    sx={{
                        position: "absolute",
                        inset: 0,
                        display: "grid",
                        placeItems: "center",
                    }}
                >
                    <LoadingSpinner />
                </Box>
            )}
        </Box>
    );
});

export default Button;
