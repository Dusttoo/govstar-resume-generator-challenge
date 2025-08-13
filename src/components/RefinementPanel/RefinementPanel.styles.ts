import { SxProps, Theme } from '@mui/material/styles';

export const panelSx: SxProps<Theme> = (theme) => ({
    display: 'grid',
    gap: theme.spacing(2),
    padding: theme.spacing(2),
});

export const rowSx: SxProps<Theme> = (theme) => ({
    display: 'grid',
    gap: theme.spacing(1),
});

export const twoColRowSx: SxProps<Theme> = (theme) => ({
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: theme.spacing(1),
    [theme.breakpoints.up('sm')]: {
        gridTemplateColumns: '1fr 1fr',
    },
});

export const chipsWrapSx: SxProps<Theme> = (theme) => ({
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.spacing(1),
});

export const actionsRowSx: SxProps<Theme> = (theme) => ({
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: theme.spacing(1),
});
