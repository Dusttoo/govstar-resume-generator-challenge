import { SxProps, Theme } from '@mui/material/styles';

export const wrapSx: SxProps<Theme> = (theme) => ({
    display: 'grid',
    gap: theme.spacing(1.5),
    padding: theme.spacing(2),
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.background.paper,
});

export const headerRowSx: SxProps<Theme> = (theme) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing(2),
});

export const titleColSx: SxProps<Theme> = (theme) => ({
    display: 'grid',
    gap: 2,
});

export const stepsWrapSx: SxProps<Theme> = (theme) => ({
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: theme.spacing(1),
    [theme.breakpoints.up('sm')]: {
        gridTemplateColumns: '1fr 1fr 1fr',
    },
});

export const stepItemSx: SxProps<Theme> = (theme) => ({
    display: 'flex',
    alignItems: 'flex-start',
    gap: theme.spacing(1),
});

export const stepNumSx: SxProps<Theme> = (theme) => ({
    width: 28,
    height: 28,
    display: 'grid',
    placeItems: 'center',
    borderRadius: '50%',
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.getContrastText(theme.palette.secondary.main),
    fontWeight: 700,
    fontSize: 13,
    flex: '0 0 auto',
    marginTop: 2,
});
