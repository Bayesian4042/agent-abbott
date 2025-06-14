# Agent Abbott

**Build Effective Agents with Model Context Protocol in TypeScript**

**agent-abbott** is a TypeScript framework. It provides a simple, composable, and type-safe way to build AI agents leveraging the [Model Context Protocol (MCP)](https://modelcontextprotocol.io/introduction) in JavaScript and TypeScript environments.

This library aims to bring the powerful patterns and architecture to the JavaScript ecosystem, enabling developers to create robust and controllable AI agents that can interact with MCP-aware services and tools.

# Demo
![Demo](https://github.com/Bayesian4042/agent-abbott/blob/main/static/demo.mp4)


## Key Capabilities

It empowers you to build sophisticated AI agents with the following core capabilities:

*   **Agent Abstraction:** Define intelligent agents with clear instructions, access to tools (both local functions and MCP servers), and integrated LLM capabilities.
*   **Model Context Protocol (MCP) Integration:** Seamlessly connect and interact with services and tools exposed through MCP servers.
*   **Local Function Tools:** Extend agent capabilities with custom, in-process JavaScript/TypeScript functions that act as tools, alongside MCP server-based tools.
*   **LLM Flexibility:** Integrate with various Large Language Models (LLMs). The library includes an example implementation for Fireworks AI, demonstrating extensibility for different LLM providers.
*   **Memory Management:** Basic in-memory message history to enable conversational agents.
*   **Workflows:** Implement complex agent workflows like the `Orchestrator` pattern to break down tasks into steps and coordinate multiple agents. Support for additional patterns from Anthropic's [Building Effective Agents](https://www.anthropic.com/research/building-effective-agents) and OpenAI's [Swarm](https://github.com/openai/swarm) coming soon.
*   **TypeScript & Type Safety:** Built with TypeScript, providing strong typing, improved code maintainability, and enhanced developer experience.

## Quick Start

### Standalone Usage

Get started quickly with a basic example (Using as standalone):

```js
import { fileURLToPath } from 'url';
import path from 'path';
import { Agent, LLMModel, Orchestrator } from 'mcp-agent'; // Import from your library name!
import { writeLocalSystem } from './tools/writeLocalSystem'; // Assuming you have example tools

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runOrchestrator() {
  const llm = new LLMModel("gpt-4o", {
    maxTokens: 2048,
    temperature: 0.1
  });

  const researcher = await Agent.initialize({
    llm,
    name: "researcher",
    description: `Your expertise is to find information.`,
    serverConfigs: [ // Example MCP Server Configurations
      {
        name: "read_file_from_local_file_system",
        type: "stdio",
        command: "node",
        args: ['--loader', 'ts-node/esm', path.resolve(__dirname, 'servers', 'readLocalFileSystem.ts'),]
      },
      {
        name: "search_web",
        type: "ws",
        url: createSmitheryUrl( // Example using community mcp server via @smithery/sdk
          "https://server.smithery.ai/exa/ws",
          {
            exaApiKey: process.env.EXA_API_KEY
          }
        )
      },
    ],
  });

  const writer = await Agent.initialize({
    llm
    name: "writer",
    description: `Your expertise is to write information to a file.`,
    functions: [writeLocalSystem], // Example local function tool
    llm,
  });

  const orchestrator = new Orchestrator({
    llm,
    agents: [researcher, writer],
  });

  const result = await orchestrator.generate('Search new latest developemnt about AI and write about it to `ai_research.md` on my local machine. no need to verify the result.');

  console.log(JSON.stringify(result));
  await researcher.close();
  await writer.close();
}

runOrchestrator().catch(console.error);
```


**To run this example:**

1.  **Install Dependencies:**
    ```bash
    pnpm install
    ```
2.  **Set Environment Variables:** Create a `.env` file (or set environment variables directly) and add your API keys (e.g., `EXA_API_KEY`, Fireworks AI API key if needed).
3.  **Run the Demo:**
    ```bash
    node --loader ts-node/esm ./demo/standalone/index.ts
    ```

### Rest server Integration
For a complete Express.js integration example with multi-agent orchestration, check out the [demo/express/README.md](./demo/express/README.md).

## Core Concepts

*   **Agent:** The fundamental building block. An `Agent` is an autonomous entity with a specific role, instructions, and access to tools.
*   **MCP Server Aggregator (`MCPServerAggregator`):** Manages connections to multiple MCP servers, providing a unified interface for agents to access tools.
*   **MCP Connection Manager (`MCPConnectionManager`):** Handles the lifecycle and reuse of MCP server connections, optimizing resource usage.
    * **Supported Transport**: `stdio`, `sse`, `streamable-http` & `websockets`
*   **LLM Integration (`LLMInterface`, `LLMModel`):**  Abstracts interaction with Large Language Models.  `LLMModel` is an example implementation for Fireworks AI models.
*   **Tools:**  Functions or MCP server capabilities that Agents can use to perform actions. Tools can be:
    *   **MCP Server Tools:** Capabilities exposed by external MCP servers (e.g., file system access, web search).
    *   **Local Function Tools:**  JavaScript/TypeScript functions defined directly within your application.
*   **Workflows:**  Composable patterns for building complex agent behaviors (see anthropic blog [here](https://www.anthropic.com/research/building-effective-agents)).
    *   **Orchestrator** - workflow demonstrates how to coordinate multiple agents to achieve a larger objective.
    *   **Prompt chaining** - coming soon.
    *   **Routing** - coming soon.
    *   **Parallelization** - coming soon.
    *   **Evaluator-optimizer** - coming soon.
*   **Memory (`SimpleMemory`):**  Provides basic in-memory message history for conversational agents.

Contributions are welcome!

