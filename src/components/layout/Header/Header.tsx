import Logo from '@/components/brand/Logo';
import useResumeStore from '@/store/resume.store';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MenuIcon from '@mui/icons-material/Menu';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import { alpha, useTheme } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import Link from 'next/link';
import { useRouter } from 'next/router';
import * as React from 'react';

export interface HeaderNavItem {
    label: string;
    href: string;
}

export interface HeaderProps {
    actions?: React.ReactNode;
    navItems?: HeaderNavItem[];
    showBack?: boolean;
    elevation?: number;
    sticky?: boolean;
}

const DEFAULT_NAV: HeaderNavItem[] = [
    { label: 'Upload', href: '/' },
    { label: 'Generate', href: '/generate' },
    { label: 'Preview', href: '/preview' },
];

export default function Header({ actions, navItems = DEFAULT_NAV, showBack = false, elevation = 0, sticky = true }: HeaderProps) {
    const theme = useTheme();
    const router = useRouter();
    const isMdUp = useMediaQuery(theme.breakpoints.up('md'));
    const [open, setOpen] = React.useState(false);

    const reset = useResumeStore((s) => s.reset);

    const handleStartOver = () => {
        try {
            if (typeof window !== 'undefined') {
                window.sessionStorage.removeItem('resume-store');
            }
        } catch { }
        reset();
        router.push('/');
    };

    const isActive = (href: string) => (href === '/' ? router.pathname === '/' : router.pathname.startsWith(href));

    const derivedActions = actions ?? (router.pathname.startsWith('/preview') ? (
        <Button onClick={handleStartOver} variant="outlined" size="small" color="inherit">Start over</Button>
    ) : null);

    const toggle = (next: boolean) => () => setOpen(next);

    return (
        <AppBar
            position={sticky ? 'sticky' : 'static'}
            elevation={elevation}
            color="transparent"
            sx={{
                borderBottom: '1px solid',
                borderColor: 'divider',
                backgroundColor: alpha(theme.palette.background.paper, 0.85),
                backdropFilter: 'saturate(180%) blur(8px)',
            }}
        >
            <Toolbar sx={{ minHeight: 64, px: 2 }}>
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ flex: 1 }}>
                    {showBack ? (
                        <IconButton aria-label="Back" onClick={() => router.back()} edge="start">
                            <ArrowBackIcon />
                        </IconButton>
                    ) : (
                        !isMdUp && (
                            <IconButton aria-label="Open menu" onClick={toggle(true)} edge="start">
                                <MenuIcon />
                            </IconButton>
                        )
                    )}

                    <Stack direction="row" spacing={1} alignItems="flex-end" component={Link} href="/" sx={{ textDecoration: 'none', color: 'inherit' }}>
                        <Logo ariaHidden />
                        <Typography variant="h6" component="span">
                            Resume Generator
                        </Typography>
                    </Stack>
                </Stack>

                {isMdUp && (
                    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mr: 2 }}>
                        {navItems.map((item) => {
                            const active = isActive(item.href);
                            const isGenerate = item.href === '/generate';

                            const underlineSx = {
                                borderBottom: active ? '2px solid' : '2px solid transparent',
                                borderColor: active ? 'secondary.main' : 'transparent',
                                borderRadius: 0,
                                '&:hover': { backgroundColor: 'transparent' },
                            } as const;

                            if (isGenerate) {
                                return active ? (
                                    <Button
                                        key={item.href}
                                        component="span"
                                        aria-current="page"
                                        disableRipple
                                        disableFocusRipple
                                        tabIndex={-1}
                                        size="small"
                                        sx={{ ...underlineSx, cursor: 'default' }}
                                    >
                                        {item.label}
                                    </Button>
                                ) : (
                                    <Button
                                        key={item.href}
                                        component="span"
                                        aria-disabled
                                        disableRipple
                                        disableFocusRipple
                                        tabIndex={-1}
                                        size="small"
                                        sx={{ opacity: 0.6, cursor: 'not-allowed' }}
                                    >
                                        {item.label}
                                    </Button>
                                );
                            }

                            return (
                                <Button
                                    key={item.href}
                                    component={Link}
                                    href={item.href}
                                    color="inherit"
                                    size="small"
                                    sx={underlineSx}
                                >
                                    {item.label}
                                </Button>
                            );
                        })}
                    </Stack>
                )}

                {derivedActions ?? null}
            </Toolbar>

            <Drawer anchor="left" open={open} onClose={toggle(false)}>
                <Box role="presentation" sx={{ width: 280 }} onClick={toggle(false)} onKeyDown={toggle(false)}>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ p: 2 }}>
                        <Logo size={120} ariaHidden />
                    </Stack>
                    <Divider />
                    <List>
                        {navItems.map((item) => {
                            const active = isActive(item.href);
                            const isGenerate = item.href === '/generate';

                            const commonSx = {
                                borderBottom: active ? '2px solid' : '2px solid transparent',
                                borderColor: active ? 'secondary.main' : 'transparent',
                                '&.Mui-selected': { backgroundColor: 'transparent' },
                                '&.Mui-selected:hover': { backgroundColor: 'transparent' },
                            } as const;

                            if (isGenerate) {
                                return active ? (
                                    <ListItemButton key={item.href} component="div" selected sx={{ ...commonSx, cursor: 'default' }}>
                                        <ListItemText primary={item.label} />
                                    </ListItemButton>
                                ) : (
                                    <ListItemButton key={item.href} component="div" disableRipple disableTouchRipple sx={{ opacity: 0.6, cursor: 'not-allowed' }}>
                                        <ListItemText primary={item.label} />
                                    </ListItemButton>
                                );
                            }

                            return (
                                <ListItemButton
                                    key={item.href}
                                    component={Link}
                                    href={item.href}
                                    selected={active}
                                    sx={commonSx}
                                >
                                    <ListItemText primary={item.label} />
                                </ListItemButton>
                            );
                        })}
                    </List>
                    {derivedActions && (
                        <>
                            <Divider />
                            <Box sx={{ p: 2 }}>{derivedActions}</Box>
                        </>
                    )}
                </Box>
            </Drawer>
        </AppBar>
    );
}