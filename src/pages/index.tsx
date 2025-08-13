import PromptEditor from "@/components/PromptEditor/PromptEditor";
import TitleBar from "@/components/TitleBar/TitleBar";
import UploadForm from "@/components/UploadForm/UploadForm";
import { Box, Grid, Paper, Stack } from "@mui/material";

export default function HomePage() {
    return (
        <Box>
            <TitleBar title="Upload your PDF resume" subtitle="We accept PDF files up to ~10MB." />

            <Grid container spacing={3} alignItems="flex-start" sx={{ mt: 2 }}>
                <Grid size={{ xs: 12, md: 6 }}>
                    <UploadForm maxSizeMB={10} />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                    <Stack spacing={2}>
                        <Paper variant="outlined" sx={{ p: 2 }}>
                            <PromptEditor />
                        </Paper>
                    </Stack>
                </Grid>
            </Grid>
        </Box>
    );
}