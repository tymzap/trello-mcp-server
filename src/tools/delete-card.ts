import { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import { z } from "zod";
import { ENV } from "../env";
import { trelloApiRequest } from "../trello-api-request";

export function registerDeleteCardTool(mcpServer: McpServer) {
  mcpServer.registerTool(
    "delete-card",
    {
      title: "Delete Card",
      description: "Delete a card.",
      inputSchema: z.object({
        id: z.string().describe("The ID of the card to delete"),
      }),
    },
    async ({ id }) => {
      const result = await trelloApiRequest(`cards/${id}`, {
        appKey: ENV.APP_KEY,
        trelloToken: ENV.TRELLO_TOKEN,
        method: "DELETE",
      });

      return {
        content: [{ type: "text", text: JSON.stringify(result) }],
      };
    },
  );
}
