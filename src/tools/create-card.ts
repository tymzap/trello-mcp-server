import { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import { z } from "zod";
import { ENV } from "../env";
import { trelloApiRequest } from "../trello-api-request";

export function registerCreateCardTool(mcpServer: McpServer) {
  mcpServer.registerTool(
    "create-card",
    {
      title: "Create Card",
      description: "Create a new card.",
      inputSchema: z.object({
        idList: z.string().describe("The ID of the list the card should be created in"),
        name: z.string().optional().describe("Name for the card"),
        desc: z.string().optional().describe("Description for the card"),
        pos: z.union([z.number(), z.enum(["top", "bottom"])]).optional().describe("Position of the card"),
        due: z.string().optional().describe("Due date (ISO 8601 format)"),
        start: z.string().optional().describe("Start date (ISO 8601 format)"),
        dueComplete: z.boolean().optional().describe("Whether the due date is marked complete"),
        idMembers: z.array(z.string()).optional().describe("Array of member IDs to assign to the card"),
        idLabels: z.array(z.string()).optional().describe("Array of label IDs to assign to the card"),
        urlSource: z.string().optional().describe("URL to attach to the card"),
      }),
    },
    async (params) => {
      const card = await trelloApiRequest("cards", {
        appKey: ENV.APP_KEY,
        trelloToken: ENV.TRELLO_TOKEN,
        method: "POST",
        searchParams: params,
      });

      return {
        content: [{ type: "text", text: JSON.stringify(card) }],
      };
    },
  );
}
