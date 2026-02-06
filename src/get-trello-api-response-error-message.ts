import { z } from "zod";

export async function getTrelloApiResponseErrorMessage(
  response: Response,
): Promise<string> {
  const textError = await getErrorMessageFromTextResponse(response);

  if (textError) {
    return textError;
  }

  const jsonError = await getErrorMessageFromJsonResponse(response);

  if (jsonError) {
    return jsonError;
  }

  return response.statusText;
}

async function getErrorMessageFromTextResponse(response: Response) {
  try {
    const textResponse = await response.clone().text();

    return textResponse;
  } catch {
    return null;
  }
}

async function getErrorMessageFromJsonResponse(response: Response) {
  try {
    const jsonResponse = await response.clone().json();

    const jsonResponseErrorSchema = z
      .object({
        error: z.string().nonempty(),
      })
      .transform((value) => value.error);

    const errorMessage = jsonResponseErrorSchema.parse(jsonResponse);

    return errorMessage;
  } catch {
    return null;
  }
}
