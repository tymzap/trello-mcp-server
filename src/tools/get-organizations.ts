import { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import { ENV } from "../env";
import { trelloApiRequest } from "../trello-api-request";

export function registerGetOrganizationsTool(mcpServer: McpServer) {
  mcpServer.registerTool(
    "get-organizations",
    {
      title: "Get Organizations",
      description:
        "Retrieves all workspaces (organizations) for the authenticated user.",
    },
    async () => {
      const organizations = await trelloApiRequest("members/me/organizations", {
        appKey: ENV.APP_KEY,
        trelloToken: ENV.TRELLO_TOKEN,
        searchParams: {
          fields: "id,name,displayName,url,idBoards,dateLastActivity",
        },
      });

      return {
        content: [{ type: "text", text: JSON.stringify(organizations) }],
      };
    },
  );
}
