import { createFileRoute, Link } from "@tanstack/react-router";
import {
	IconBookOpen,
	IconChevronLeft,
	IconCloudDownload,
	IconGlobe,
} from "justd-icons";
import {
	FileTrigger,
	isFileDropItem,
	Button as ReactAriaButton,
} from "react-aria-components";
import { useListData } from "react-stately";
import type { DropEvent } from "@react-types/shared";
import { buttonStyles } from "~ui/button";
import { Card } from "~ui/card";
import { DropZone } from "~ui/drop-zone";
import { Heading } from "~ui/heading";
import { TextField } from "~ui/text-field";
import { Select } from "~ui/select";
import { TagField } from "~ui/tag-field";

export const Route = createFileRoute("/_main/donations/new")({
	loader: () => {
		return {
			crumb: "New Donation",
			title: "New Donation",
		};
	},
	component: NewDonation,
});

function NewDonation() {
	const selectedItems = useListData({
		initialItems: [],
	});
	const onSelectHandler = async (e: any) => {
		if (e) {
			const files = Array.from([...e]);
			const item = files[0];

			console.log(item);
		}
	};

	const onDropHandler = async (e: DropEvent) => {
		const item = e.items
			.filter(isFileDropItem)
			.find((item) => item.type === "image/jpeg" || item.type === "image/png");
	};

	return (
		<div>
			<Link
				className={buttonStyles({
					appearance: "outline",
					size: "extra-small",
					className: "mb-4 mt-1",
				})}
				to="/donations"
				search={{
					status: "all",
					page: 1,
					pageSize: 10,
				}}
			>
				<IconChevronLeft />
				Back
			</Link>
			<Heading className="mb-4" level={2} tracking="tight">
				Donations
			</Heading>
			<div>
				<Card>
					<Card.Header>
						<Card.Title>New Donation</Card.Title>
						<Card.Description className="text-xs text-muted-fg leading-tight">
							Create a new donation to support the cause.
						</Card.Description>
					</Card.Header>
					<Card.Content>
						<form>
							<div className="space-y-4">
								<TextField
									label="Title"
									name="title"
									placeholder="Book title"
								/>
								<TextField
									label="Description"
									name="description"
									placeholder="Book description"
								/>
								<DropZone
									className="border-solid"
									getDropOperation={(types) =>
										types.has("image/jpeg") || types.has("image/png")
											? "copy"
											: "cancel"
									}
									onDrop={onDropHandler}
								>
									<div className="flex flex-col justify-center items-center">
										<div
											className={buttonStyles({
												size: "square-petite",
												intent: "secondary",
												className: "mb-3",
											})}
										>
											<IconCloudDownload />
										</div>
										<div className="flex items-center gap-x-1">
											<FileTrigger
												acceptedFileTypes={["image/png", "image/jpeg"]}
												allowsMultiple={false}
												onSelect={onSelectHandler}
											>
												<ReactAriaButton className="text-sm font-semibold text-primary focus:outline-none">
													Click to upload
												</ReactAriaButton>
											</FileTrigger>
											<span className="text-sm text-muted-fg">
												or drag and drop
											</span>
										</div>
										<p className="text-xs text-muted-fg mt-1">
											SVG, PNG, JPG or GIF (max. 800x400px)
										</p>
									</div>
									<input type="hidden" name="image" />
								</DropZone>
								<Select label="Language" placeholder="Select a language">
									<Select.Trigger prefix={<IconGlobe />} />
									<Select.List
										items={[
											{
												id: "english",
												label: "English",
											},
											{
												id: "spanish",
												label: "Spanish",
											},
											{
												id: "french",
												label: "French",
											},
											{
												id: "german",
												label: "German",
											},
											{
												id: "other",
												label: "Other",
											},
										]}
									>
										{(item) => (
											<Select.Option className="text-sm">
												{item.label}
											</Select.Option>
										)}
									</Select.List>
								</Select>
								<Select label="Condition" placeholder="Select book condition">
									<Select.Trigger prefix={<IconBookOpen />} />
									<Select.List
										items={[
											{
												id: "new",
												label: "New",
											},
											{
												id: "likeNew",
												label: "Like New",
											},
											{
												id: "good",
												label: "Good",
											},
											{
												id: "fair",
												label: "Fair",
											},
											{
												id: "poor",
												label: "Poor",
											},
										]}
									>
										{(item) => (
											<Select.Option className="text-sm">
												{item.label}
											</Select.Option>
										)}
									</Select.List>
								</Select>
								<TagField
									className="text-sm"
									max={3}
									description="Add up to 3 tags to describe the book"
									label="Add tag"
									list={selectedItems}
									descriptionClassName="text-xs"
								/>
							</div>
						</form>
					</Card.Content>
				</Card>
			</div>
		</div>
	);
}
