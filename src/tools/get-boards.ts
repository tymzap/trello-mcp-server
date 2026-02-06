import { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import { ENV } from "../env";
import { trelloApiRequest } from "../trello-api-request";

export function registerGetBoardsTool(mcpServer: McpServer) {
  mcpServer.registerTool(
    "get-boards",
    {
      title: "Get Boards",
      description: "Retrieves all open Trello boards for the authenticated user.",
    },
    async () => {
      const boards = await trelloApiRequest("members/me/boards", {
        appKey: ENV.APP_KEY,
        trelloToken: ENV.TRELLO_TOKEN,
        searchParams: {
          filter: "open",
          fields: "id,name,url,dateLastActivity,desc,closed",
        },
      });

      return {
        content: [{ type: "text", text: JSON.stringify(boards) }],
      };
    },
  );
}
