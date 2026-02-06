export function composeErrorMessage(
  error: unknown,
  genericMessage: string,
): string {
  if (typeof error === "string") {
    return `${genericMessage}: ${error}`;
  }

  if (
    error &&
    typeof error === "object" &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return `${genericMessage}: ${error.message}`;
  }

  return genericMessage;
}
