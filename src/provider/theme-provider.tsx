'use client';

import { TooltipProvider } from '@/components/ui/tooltip';
import {ThemeProvider as NextThemesProvider, type ThemeProviderProps} from 'next-themes';
import * as React from 'react';


export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
    return (
        <NextThemesProvider {...props}>
            <TooltipProvider>{children}</TooltipProvider>
        </NextThemesProvider>
    );
}