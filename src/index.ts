import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerGetBoardsTool } from "./tools/get-boards";

const mcpServer = new McpServer({
  name: "trello",
  version: "0.1.0",
});

registerGetBoardsTool(mcpServer);

mcpServer.connect(new StdioServerTransport()).then(() => {
  console.log("MCP server is listening...");
});
