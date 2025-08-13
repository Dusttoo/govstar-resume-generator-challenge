import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

export interface SpinnerProps {
    size?: number;
    thickness?: number;
    label?: string;
}

export default function Spinner({ size = 28, thickness = 4.5, label }: SpinnerProps) {
    return (
        <Stack direction="row" spacing={1} alignItems="center">
            <CircularProgress size={size} thickness={thickness} />
            {label && (
                <Typography variant="body2" color="text.secondary">
                    {label}
                </Typography>
            )}
        </Stack>
    );
}
