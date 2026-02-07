import { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import { z } from "zod";
import { ENV } from "../env";
import { trelloApiRequest } from "../trello-api-request";

export function registerUpdateCardTool(mcpServer: McpServer) {
  mcpServer.registerTool(
    "update-card",
    {
      title: "Update Card",
      description: "Updates a Trello card with new values.",
      inputSchema,
    },
    async ({ id, ...input }) => {
      const updatedCard = await trelloApiRequest(`cards/${id}`, {
        appKey: ENV.APP_KEY,
        trelloToken: ENV.TRELLO_TOKEN,
        method: "PUT",
        searchParams: input,
      });

      return {
        content: [{ type: "text", text: JSON.stringify(updatedCard) }],
      };
    },
  );
}

const inputSchema = z.object({
  id: z.string().describe("The ID of the card to update"),
  name: z.string().optional().describe("New name for the card"),
  desc: z.string().optional().describe("New description for the card"),
  due: z
    .string()
    .optional()
    .describe("Due date (ISO 8601 format) or null to remove"),
  dueComplete: z
    .boolean()
    .optional()
    .describe("Whether the due date is marked complete"),
  idList: z.string().optional().describe("ID of the list to move the card to"),
  idBoard: z
    .string()
    .optional()
    .describe("ID of the board to move the card to"),
  closed: z.boolean().optional().describe("Whether the card is archived"),
  idMembers: z
    .array(z.string())
    .optional()
    .describe("Array of member IDs to assign to the card"),
  idLabels: z
    .array(z.string())
    .optional()
    .describe("Array of label IDs to assign to the card"),
  pos: z
    .union([z.number(), z.enum(["top", "bottom"])])
    .optional()
    .describe("Position of the card"),
});
