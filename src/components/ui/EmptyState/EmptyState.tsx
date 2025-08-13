import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import * as React from "react";

export interface EmptyStateProps {
    icon?: React.ReactNode;
    title: string;
    description?: string | React.ReactNode;
    actions?: React.ReactNode;
    size?: "sm" | "md" | "lg";
    outlined?: boolean;
}

export default function EmptyState({ icon, title, description, actions, size = "md", outlined = true }: EmptyStateProps) {
    const paddings = { sm: 2, md: 3, lg: 5 } as const;
    const iconSize = { sm: 28, md: 40, lg: 56 } as const;

    const content = (
        <Stack spacing={1.2} alignItems="center" textAlign="center">
            {icon && (
                <Box aria-hidden sx={{ svg: { width: iconSize[size], height: iconSize[size] } }}>{icon}</Box>
            )}
            <Typography variant="h5">{title}</Typography>
            {description && (
                <Typography variant="body2" color="text.secondary">
                    {description}
                </Typography>
            )}
            {actions}
        </Stack>
    );

    if (outlined) {
        return (
            <Paper variant="outlined" sx={{ p: paddings[size] }}>
                {content}
            </Paper>
        );
    }
    return <Box sx={{ p: paddings[size] }}>{content}</Box>;
}
