import { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import { z } from "zod";
import { ENV } from "../env";
import { trelloApiRequest } from "../trello-api-request";

export function registerGetMemberTool(mcpServer: McpServer) {
  mcpServer.registerTool(
    "get-member",
    {
      title: "Get Member",
      description:
        'Retrieves a Trello member by their ID. Use "me" as the ID to fetch the currently authenticated member.',
      inputSchema: z.object({
        id: z
          .string()
          .describe(
            'The ID or of the member to retrieve.',
          ),
      }),
    },
    async ({ id }) => {
      const member = await trelloApiRequest(`members/${id}`, {
        appKey: ENV.APP_KEY,
        trelloToken: ENV.TRELLO_TOKEN,
        searchParams: {
          fields:
            "id,fullName,username,initials,avatarUrl,bio,url,memberType,confirmed,status,email,idBoards,idOrganizations",
        },
      });

      return {
        content: [{ type: "text", text: JSON.stringify(member) }],
      };
    },
  );
}
