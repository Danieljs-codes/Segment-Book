import type { ComponentProps } from "react";
import { useTheme } from "~components/theme-provider";
import LogoLight from "~/assets/Logo.svg?react";
import LogoDark from "~/assets/Logo-dark.svg?react";

interface LogoProps extends ComponentProps<"svg"> {
	className?: string;
}

export function Logo({ className, ...props }: LogoProps) {
	const { theme } = useTheme();
	const LogoComponent = theme === "light" ? LogoLight : LogoDark;
	return <LogoComponent className={className} {...props} />;
}
