import type React from "react";
import { cn } from "~ui/primitive";

interface EmptyStateProps {
	title: string;
	description: string;
	icon?: React.ComponentType;
	children?: React.ReactNode;
	className?: string;
}

function EmptyStateIcon({
	icon: Icon,
	className,
}: { icon: React.ComponentType<{ className?: string }>; className?: string }) {
	return <Icon className={cn("size-6 text-muted-fg", className)} />;
}

function EmptyState({
	title,
	description,
	icon: Icon,
	children,
	className,
}: EmptyStateProps): JSX.Element {
	return (
		<div className={cn("flex flex-col items-center text-center", className)}>
			{Icon && <EmptyStateIcon icon={Icon} className="mb-4" />}
			<h3 className="text-base font-semibold">{title}</h3>
			<p className="mt-2 text-sm leading-tight text-pretty text-muted-fg">
				{description}
			</p>
			{children && <div className="mt-6 flex gap-3">{children}</div>}
		</div>
	);
}

EmptyState.Icon = EmptyStateIcon;

export { EmptyState };
