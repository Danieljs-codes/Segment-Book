import { createFileRoute, Link } from "@tanstack/react-router";
import { IconBookOpen, IconChevronLeft, IconGlobe } from "justd-icons";
import { useListData } from "react-stately";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, buttonStyles } from "~ui/button";
import { Card } from "~ui/card";
import { Heading } from "~ui/heading";
import { TextField } from "~ui/text-field";
import { Select } from "~ui/select";
import { TagField } from "~ui/tag-field";
import { donationSchema, type DonationFormData } from "~/lib/schema";
import { Textarea } from "~ui/textarea";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "~lib/supabase";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/_main/donations/new")({
	loader: ({ context }) => {
		return {
			userId: context.session.user.id,
			crumb: "New Donation",
			title: "New Donation",
		};
	},
	component: NewDonation,
});

function NewDonation() {
	const queryClient = useQueryClient();
	const { userId } = Route.useLoaderData();
	const navigate = useNavigate();

	const {
		control,
		handleSubmit,
		formState: { errors },
		setValue,
		register,
	} = useForm<DonationFormData>({
		resolver: zodResolver(donationSchema),
		defaultValues: {
			title: "",
			author: "", // Add this
			description: "",
			language: undefined,
			condition: undefined,
			tags: [],
			image: undefined,
		},
	});

	const { mutateAsync: createDonation } = useMutation({
		mutationKey: ["createDonation"],
		mutationFn: async (input: DonationFormData & { userId: string }) => {
			const { data: uploadData, error: uploadError } = await supabase.storage
				.from("Books-image")
				.upload(`public/${Date.now()}_${input.image.name}`, input.image);

			if (uploadError) throw uploadError;

			const imageUrl = uploadData.path;

			const { data, error } = await supabase.rpc("create_book", {
				book_data: {
					title: input.title,
					author: input.author, // Add this
					ownerId: userId,
					description: input.description,
					language: input.language,
					condition: input.condition,
					tags: input.tags,
					image_url: imageUrl,
				},
			});

			if (error) throw error;

			return data;
		},

		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ["user-donated-books"] });
			queryClient.invalidateQueries({ queryKey: ["total-donations"] });
			queryClient.invalidateQueries({ queryKey: ["listed-not-donated-books"] });
			queryClient.invalidateQueries({ queryKey: ["book-filters"] });

			navigate({
				to: "/donations",
				search: {
					status: "all",
					page: 1,
					pageSize: 10,
				},
			});
		},
	});

	const selectedItems = useListData({
		initialItems: [],
	});

	const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files.length > 0) {
			const file = e.target.files[0];
			setValue("image", file);
		}
	};

	const onSubmit = (data: DonationFormData) => {
		console.log(data, userId);
		toast.promise(createDonation({ ...data, userId: userId }), {
			loading: "Creating donation...",
			success: "Donation created successfully!",
			error: "Failed to create donation. Please try again.",
		});
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
						<form onSubmit={handleSubmit(onSubmit)}>
							<div className="space-y-4">
								<Controller
									name="title"
									control={control}
									render={({ field }) => (
										<TextField
											label="Title"
											placeholder="Book title"
											errorMessage={errors.title?.message}
											isInvalid={!!errors.title}
											{...field}
										/>
									)}
								/>
								<Controller
									name="author" // Add this block
									control={control}
									render={({ field }) => (
										<TextField
											label="Author"
											placeholder="Book author"
											errorMessage={errors.author?.message}
											isInvalid={!!errors.author}
											{...field}
										/>
									)}
								/>
								<Controller
									name="description"
									control={control}
									render={({ field }) => (
										<Textarea
											label="Description"
											placeholder="Book description"
											errorMessage={errors.description?.message}
											isInvalid={!!errors.description}
											rows={4}
											className="text-sm"
											{...field}
										/>
									)}
								/>
								<Controller
									name="image"
									control={control}
									rules={{ required: "Image is required" }}
									render={({ field: { onChange, value, ...field } }) => (
										<div>
											<label
												htmlFor="image"
												className="block text-sm font-medium text-fg"
											>
												Image <span className="text-red-500">*</span>
											</label>
											<input
												type="file"
												id="image"
												accept="image/*"
												{...register("image", {
													required: "Image is required",
												})}
												onChange={(e) => {
													onFileChange(e);
													onChange(e.target.files?.[0]);
												}}
												className="mt-1 block w-full text-sm text-gray-500
													file:mr-4 file:py-2 file:px-4
													file:rounded-full file:border-0
													file:text-sm file:font-semibold
													file:bg-muted file:text-muted-fg
													hover:file:bg-muted-fg hover:file:text-muted"
												{...field}
												required
											/>
											{errors.image && (
												<p className="mt-1 text-sm text-red-600">
													{errors.image.message}
												</p>
											)}
										</div>
									)}
								/>
								<Controller
									name="language"
									control={control}
									render={({ field }) => (
										<Select
											label="Language"
											placeholder="Select a language"
											errorMessage={errors.language?.message}
											isInvalid={!!errors.language}
											selectedKey={field.value}
											onSelectionChange={(key) => {
												field.onChange(key);
											}}
											{...field}
										>
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
									)}
								/>
								<Controller
									name="condition"
									control={control}
									render={({ field }) => (
										<Select
											label="Condition"
											placeholder="Select book condition"
											errorMessage={errors.condition?.message}
											isInvalid={!!errors.condition}
											selectedKey={field.value}
											onSelectionChange={(key) => {
												field.onChange(key);
											}}
											{...field}
										>
											<Select.Trigger prefix={<IconBookOpen />} />
											<Select.List
												items={[
													{
														id: "like new",
														label: "Like New",
													},
													{
														id: "excellent",
														label: "Excellent",
													},
													{
														id: "fair",
														label: "Fair",
													},
													{
														id: "good",
														label: "Good",
													},
													{
														id: "acceptable",
														label: "Acceptable",
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
									)}
								/>
								<Controller
									name="tags"
									control={control}
									render={({ field, fieldState: { error } }) => (
										<TagField
											className="text-sm"
											max={3}
											description="Add up to 3 tags to describe the book"
											label="Add tag"
											list={selectedItems}
											descriptionClassName="text-xs"
											onItemInserted={(item) => {
												field.onChange([...field.value, item.name]);
											}}
											onItemCleared={(item) => {
												field.onChange(
													field.value.filter((tag) => tag !== item.name),
												);
											}}
											errorMessage={error?.message}
										/>
									)}
								/>
								<Button
									type="submit"
									intent="primary"
									size="small"
									className="w-full"
								>
									Submit Donation
								</Button>
							</div>
						</form>
					</Card.Content>
				</Card>
			</div>
		</div>
	);
}
