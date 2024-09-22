"use client";

import * as React from "react";

import type { Key } from "react-aria-components";
import { Group, TextField } from "react-aria-components";
import type { ListData } from "react-stately";
import { twJoin } from "tailwind-merge";
import { tv } from "tailwind-variants";

import type { FieldProps } from "./field";
import { Description, FieldError, Input, Label } from "./field";
import { cn } from "./primitive";
import type { RestrictedIntent, TagGroupProps } from "./tag-group";
import { Tag } from "./tag-group";

const tagFieldsStyles = tv({
	base: ["relative flex min-h-10 bg-bg flex-row flex-wrap items-center"],
	variants: {
		appearance: {
			outline: [
				"px-1 rounded-lg shadow-sm border",
				"has-[input[data-focused=true]]:border-primary",
				"has-[input[data-invalid=true][data-focused=true]]:border-danger has-[input[data-invalid=true]]:border-danger has-[input[data-invalid=true]]:ring-danger/20",
				"has-[input[data-focused=true]]:ring-4 has-[input[data-focused=true]]:ring-primary/20",
			],
			plain: ["has-[input[data-focused=true]]:border-transparent"],
		},
	},
});

interface TagItemProps {
	id: number;
	name: string;
}

interface TagFieldProps
	extends Pick<TagGroupProps, "shape">,
		FieldProps,
		React.RefAttributes<HTMLDivElement> {
	intent?: RestrictedIntent;
	isDisabled?: boolean;
	max?: number;
	className?: string;
	children?: React.ReactNode;
	name?: string;
	list: ListData<TagItemProps>;
	onItemInserted?: (tag: TagItemProps) => void;
	onItemCleared?: (tag: TagItemProps) => void;
	appearance?: "outline" | "plain";
	descriptionClassName?: string;
}

const TagField = React.forwardRef<HTMLDivElement, TagFieldProps>(
	(
		{
			appearance = "outline",
			name,
			className,
			descriptionClassName,
			list,
			onItemCleared,
			onItemInserted,
			...props
		},
		ref,
	) => {
		const [isInvalid, setIsInvalid] = React.useState(false);
		const [inputValue, setInputValue] = React.useState("");

		const existingTagCount = list.items.length;
		const maxTags =
			props.max !== undefined ? props.max : Number.POSITIVE_INFINITY;
		const maxTagsToAdd = maxTags - existingTagCount;

		const insertTag = () => {
			const tagNames = inputValue.split(/,/);
			if (maxTagsToAdd <= 0) {
				setIsInvalid(true);
				setInputValue("");
				const timeoutId = setTimeout(() => {
					setIsInvalid(false);
				}, 2000);

				return () => clearTimeout(timeoutId);
			}

			for (const tagName of tagNames.slice(0, maxTagsToAdd)) {
				const formattedName = tagName
					.trim()
					.replace(/\s+/g, " ")
					.replace(/[\t\r\n]/g, "");

				if (
					formattedName &&
					!list.items.some(
						({ name }) => name.toLowerCase() === formattedName.toLowerCase(),
					)
				) {
					const tag = {
						id: (list.items.at(-1)?.id ?? 0) + 1,
						name: formattedName,
					};

					list.append(tag);
					onItemInserted?.(tag);
				}
			}

			setInputValue("");
		};

		const clearInvalidFeedback = () => {
			if (maxTags - list.items.length <= maxTagsToAdd) {
				setIsInvalid(false);
			}
		};

		const onRemove = (keys: Set<Key>) => {
			list.remove(...keys);
			onItemCleared?.(list.getItem([...keys][0]));
			clearInvalidFeedback();
		};

		const onKeyDown = (e: React.KeyboardEvent) => {
			if (e.key === "Enter" || e.key === ",") {
				e.preventDefault();
				insertTag();
			}

			if (e.key === "Backspace" && inputValue === "") {
				popLast();
				clearInvalidFeedback();
			}
		};

		const popLast = React.useCallback(() => {
			if (list.items.length === 0) {
				return;
			}

			const endKey = list.items[list.items.length - 1];

			if (endKey !== null) {
				list.remove(endKey.id);
				onItemCleared?.(list.getItem(endKey.id));
			}
		}, [list, onItemCleared]);

		return (
			<div ref={ref} className={cn("flex flex-col gap-1 w-full", className)}>
				{props.label && <Label>{props.label}</Label>}
				<Group
					className={twJoin("flex flex-col", props.isDisabled && "opacity-50")}
				>
					<Tag.Group
						intent={props.intent}
						shape={props.shape}
						aria-label="List item inserted"
						onRemove={onRemove}
					>
						<div className={tagFieldsStyles({ appearance })}>
							<div className="flex flex-1 flex-wrap items-center">
								<Tag.List
									items={list.items}
									className={twJoin(
										list.items.length !== 0
											? appearance === "outline" && "py-1.5 px-0.5 gap-1.5"
											: "gap-0",
										props.shape === "square" &&
											"[&_.jdt3lr2x]:rounded-[calc(var(--radius)-4px)]",
										"[&_.jdt3lr2x]:cursor-default last:[&_.jdt3lr2x]:-mr-1 outline-none",
									)}
								>
									{(item) => <Tag.Item>{item.name}</Tag.Item>}
								</Tag.List>
								<TextField
									isDisabled={props.isDisabled}
									aria-label={
										props?.label ?? (props["aria-label"] || props.placeholder)
									}
									isInvalid={isInvalid}
									onKeyDown={onKeyDown}
									onChange={setInputValue}
									value={inputValue}
									{...props}
								>
									<Input
										className="w-auto inline text-sm"
										placeholder={
											maxTagsToAdd <= 0
												? "Remove one to add more"
												: props.placeholder
										}
									/>
								</TextField>
							</div>
						</div>
					</Tag.Group>
					{name && (
						<input
							hidden
							name={name}
							value={list.items.map((i) => i.name).join(",")}
							readOnly
						/>
					)}
				</Group>
				{props.errorMessage ? (
					<p className="text-sm text-danger forced-colors:text-[Mark]">
						{/* @ts-ignore */}
						{props.errorMessage}
					</p>
				) : props.description ? (
					<Description className={cn(descriptionClassName)}>
						{props.description}
					</Description>
				) : null}
			</div>
		);
	},
);

TagField.displayName = "TagField";

export { TagField, type TagItemProps };
