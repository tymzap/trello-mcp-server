import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerDeleteCardTool } from "./tools/delete-card";
import { registerGetBoardsTool } from "./tools/get-boards";
import { registerGetBoardCardsTool } from "./tools/get-board-cards";
import { registerGetOrganizationsTool } from "./tools/get-organizations";
import { registerSearchTool } from "./tools/search";
import { registerUpdateCardTool } from "./tools/update-card";

const mcpServer = new McpServer({
  name: "trello",
  version: "0.4.0",
});

registerDeleteCardTool(mcpServer);
registerGetBoardsTool(mcpServer);
registerGetBoardCardsTool(mcpServer);
registerGetOrganizationsTool(mcpServer);
registerSearchTool(mcpServer);
registerUpdateCardTool(mcpServer);

mcpServer.connect(new StdioServerTransport()).then(() => {
  console.log("MCP server is listening...");
});
