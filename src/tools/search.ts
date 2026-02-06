import { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import { z } from "zod";
import { ENV } from "../env";
import { trelloApiRequest } from "../trello-api-request";

export function registerSearchTool(mcpServer: McpServer) {
  mcpServer.registerTool(
    "search",
    {
      title: "Search",
      description: "Search for Trello cards using various search operators.",
      inputSchema: z.object({
        query: z.string().describe(queryDescription),
      }),
    },
    async ({ query }) => {
      const result = await trelloApiRequest("search", {
        appKey: ENV.APP_KEY,
        trelloToken: ENV.TRELLO_TOKEN,
        searchParams: {
          query,
          modelTypes: "cards",
          card_fields:
            "id,name,url,dateLastActivity,desc,closed,due,idBoard,idList,labels",
        },
      });

      return {
        content: [{ type: "text", text: JSON.stringify(result) }],
      };
    },
  );
}

const queryDescription = `Search query with optional operators:
@name or member:name - Cards assigned to a member. @me for your cards.
#label or label:name - Cards with a specific label.
board:id or board:keyword - Cards from a specific board or boards matching keyword.
list:name - Cards within a specific list.
has:attachments - Cards with attachments. Also: has:description, has:cover, has:members, has:stickers.
due:day - Cards due in 24 hours. Also: due:week, due:month, due:overdue, or due:14 for next 14 days.
edited:day - Cards edited in last 24 hours. Also: edited:week, edited:month, or edited:21 for last 21 days.
description:text, checklist:text, comment:text, name:text - Match text in card fields.
is:open, is:complete, is:incomplete, is:starred - Filter by card status.
sort:created, sort:edited, sort:due - Sort results.`;
