import { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import { z } from "zod";
import { ENV } from "../env";
import { trelloApiRequest } from "../trello-api-request";

export function registerGetBoardCardsTool(mcpServer: McpServer) {
  mcpServer.registerTool(
    "get-board-cards",
    {
      title: "Get Board Cards",
      description: "Get all of the open cards on a board.",
      inputSchema: z.object({
        id: z.string().describe("The ID of the board"),
      }),
    },
    async ({ id }) => {
      const cards = await trelloApiRequest(`boards/${id}/cards`, {
        appKey: ENV.APP_KEY,
        trelloToken: ENV.TRELLO_TOKEN,
        searchParams: {
          fields: "id,name,url,dateLastActivity,desc,closed,due,idBoard,idList,labels",
        },
      });

      return {
        content: [{ type: "text", text: JSON.stringify(cards) }],
      };
    },
  );
}
