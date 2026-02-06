import dotenvFlow from "dotenv-flow";
import { z } from "zod";
import { composeErrorMessage } from "./compose-error-message";

dotenvFlow.config();

const envSchema = z.object({
  TRELLO_TOKEN: z.string().nonempty(),
  APP_KEY: z.string().nonempty(),
});

const parseResult = envSchema.safeParse(process.env);

if (!parseResult.success) {
  throw new Error(
    composeErrorMessage(
      parseResult.error,
      "Failed to parse environment from process.env",
    ),
  );
}

export const ENV = parseResult.data;
