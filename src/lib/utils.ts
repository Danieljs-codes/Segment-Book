/**
 * Converts a full name to kebab case.
 * @param fullName The full name to convert.
 * @returns The kebab case version of the full name.
 */
function fullNameToKebabCase(fullName: string): string {
	if (!fullName) return "";

	return fullName
		.toLowerCase()
		.replace(/\s+/g, "-")
		.replace(/[^a-z0-9-]/g, "");
}
