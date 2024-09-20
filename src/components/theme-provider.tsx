"use client";

import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
	theme: Theme;
	setTheme: (theme: Theme) => void;
}

let timeoutAction: number | Timer | undefined;
let timeoutEnable: number | Timer | undefined;

// https://reemus.dev/article/disable-css-transition-color-scheme-change#heading-best-solution---getcomputedstyle
// https://paco.me/writing/disable-theme-transitions
// Perform a task without any css transitions
export const withoutTransition = (action: () => any) => {
	// Clear fallback timeouts
	clearTimeout(timeoutAction);
	clearTimeout(timeoutEnable);

	// Create style element to disable transitions
	const style = document.createElement("style");
	const css = document.createTextNode(`* {
     -webkit-transition: none !important;
     -moz-transition: none !important;
     -o-transition: none !important;
     -ms-transition: none !important;
     transition: none !important;
  }`);
	style.appendChild(css);

	// Functions to insert and remove style element
	const disable = () => document.head.appendChild(style);
	const enable = () => document.head.removeChild(style);

	// Best method, getComputedStyle forces browser to repaint
	if (typeof window.getComputedStyle !== "undefined") {
		disable();
		action();
		window.getComputedStyle(style).opacity;
		enable();
		return;
	}

	// Better method, requestAnimationFrame processes function before next repaint
	if (typeof window.requestAnimationFrame !== "undefined") {
		disable();
		action();
		window.requestAnimationFrame(enable);
		return;
	}

	// Fallback
	disable();
	timeoutAction = setTimeout(() => {
		action();
		timeoutEnable = setTimeout(enable, 120);
	}, 120);
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
	children: React.ReactNode;
	defaultTheme?: Theme;
}

export function ThemeProvider({
	children,
	defaultTheme = "light",
}: ThemeProviderProps) {
	const [theme, setTheme] = useState<Theme>(() => {
		if (typeof window !== "undefined") {
			const savedTheme = localStorage.getItem("theme") as Theme;
			return savedTheme || defaultTheme;
		}
		return defaultTheme;
	});

	useEffect(() => {
		withoutTransition(() => {
			const root = window.document.documentElement;
			root.classList.remove("light", "dark");
			root.classList.add(theme);
			localStorage.setItem("theme", theme);
		});
	}, [theme]);

	return (
		<ThemeContext.Provider value={{ theme, setTheme }}>
			{children}
		</ThemeContext.Provider>
	);
}

export function useTheme() {
	const context = useContext(ThemeContext);
	if (context === undefined) {
		throw new Error("useTheme must be used within a ThemeProvider");
	}
	return context;
}
