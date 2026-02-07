import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerGetBoardsTool } from "./tools/get-boards";
import { registerSearchTool } from "./tools/search";
import { registerUpdateCardTool } from "./tools/update-card";

const mcpServer = new McpServer({
  name: "trello",
  version: "0.3.0",
});

registerGetBoardsTool(mcpServer);
registerSearchTool(mcpServer);
registerUpdateCardTool(mcpServer);

mcpServer.connect(new StdioServerTransport()).then(() => {
  console.log("MCP server is listening...");
});
