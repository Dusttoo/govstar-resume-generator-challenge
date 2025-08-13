import { ReactNode } from 'react';

export type TitleBarVariant = 'home' | 'generate' | 'preview';

export interface TitleBarProps {
    variant?: TitleBarVariant;
    title?: string;
    subtitle?: string;
    actions?: ReactNode;
    hideSteps?: boolean;
    className?: string;
}
