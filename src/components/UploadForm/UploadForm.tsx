import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DescriptionIcon from "@mui/icons-material/Description";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/router";
import { useCallback, useMemo, useState } from "react";
import { FileRejection, useDropzone } from "react-dropzone";

import { useToast } from "@/components/ui/Toast/Toast";
import useResumeStore from "@/store/resume.store";
import { dropAreaSx, fileInfoRowSx, helperTextSx } from "./UploadForm.styles";
import type { UploadFormProps } from "./UploadForm.types";

function formatBytes(bytes: number): string {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB", "TB"] as const;
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const val = parseFloat((bytes / Math.pow(k, i)).toFixed(2));
    return `${val} ${sizes[i]}`;
}

export default function UploadForm({ maxSizeMB = 10, disabled = false, onContinue, className }: UploadFormProps) {
    const router = useRouter();
    const file = useResumeStore((s) => s.file);
    const fileUrl = useResumeStore((s) => s.fileUrl);
    const setFile = useResumeStore((s) => s.setFile);
    const replaceFile = useResumeStore((s) => s.replaceFile);
    const clearFile = useResumeStore((s) => s.clearFile);
    const setError = useResumeStore((s) => s.setError);
    const startUploading = useResumeStore((s) => s.startUploading);
    const { showToast } = useToast();

    const [localError, setLocalError] = useState<string | null>(null);
    const maxSizeBytes = useMemo(() => maxSizeMB * 1024 * 1024, [maxSizeMB]);

    const onDrop = useCallback(
        (acceptedFiles: File[], rejections: FileRejection[]) => {
            setLocalError(null);

            if (rejections && rejections.length > 0) {
                const r = rejections[0];
                const code = r.errors[0]?.code;
                let message = "Unsupported file.";
                if (code === "file-too-large") message = `File is too large. Max ${maxSizeMB} MB.`;
                if (code === "file-invalid-type") message = "Only PDF files are accepted.";
                if (code === "too-many-files") message = "Only one file can be uploaded.";
                setLocalError(message);
                setError(message);
                showToast(message, { severity: "error" });
                return;
            }

            const next = acceptedFiles[0];
            if (!next) return;

            if (file) {
                replaceFile(next);
            } else {
                setFile(next);
            }
        },
        [file, maxSizeMB, replaceFile, setError, setFile, showToast]
    );

    const accept = useMemo(() => ({ "application/pdf": [".pdf"] }), []);

    const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject, open } = useDropzone({
        onDrop,
        multiple: false,
        noClick: true,
        accept,
        maxSize: maxSizeBytes,
        disabled,
    });

    const handleBrowse = () => {
        if (disabled) return;
        open();
    };

    const handleContinue = () => {
        if (!fileUrl) return;
        startUploading();
        if (onContinue) onContinue();
        else router.push("/generate");
    };

    const handleRemove = () => {
        clearFile();
        setLocalError(null);
    };

    return (
        <Stack spacing={2} className={className}>
            <Paper variant="outlined" sx={dropAreaSx({ isDragActive, isDragAccept, isDragReject, disabled })} {...getRootProps()}>
                <input {...getInputProps()} aria-label="Upload PDF resume" />

                <Stack spacing={2} alignItems="center" textAlign="center">
                    <CloudUploadIcon fontSize="large" />
                    <Typography variant="h3">Upload a resume</Typography>
                    <Typography variant="body2" sx={helperTextSx}>
                        Drag & drop a PDF here, or use the button below. Max size {maxSizeMB} MB.
                    </Typography>

                    <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
                        <Button onClick={handleBrowse} variant="contained" color="primary" startIcon={<CloudUploadIcon />} disabled={disabled}>
                            Browse files
                        </Button>
                        {!!file && (
                            <Button onClick={handleRemove} variant="outlined" color="inherit" startIcon={<RestartAltIcon />} disabled={disabled}>
                                Remove
                            </Button>
                        )}
                    </Stack>
                </Stack>
            </Paper>

            {file && (
                <Box sx={fileInfoRowSx}>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <DescriptionIcon />
                        <Typography variant="body1" sx={{ wordBreak: "break-all" }}>
                            {file.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {formatBytes(file.size)}
                        </Typography>
                    </Stack>
                    <Stack direction="row" spacing={1}>
                        <Button variant="text" onClick={handleBrowse} disabled={disabled}>
                            Replace file
                        </Button>

                    </Stack>
                </Box>
            )}

            {localError && <Alert severity="error">{localError}</Alert>}
        </Stack>
    );
}
