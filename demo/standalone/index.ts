
import dotenv from 'dotenv';
import { createSmitheryUrl } from "@smithery/sdk/config"
import { fileURLToPath } from 'url';
import path from 'path';
import { Agent, LLMModel, Orchestrator } from '../../src';
import { writeLocalSystem } from '../tools/writeLocalSystem';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runOrchestrator() {
  const llm = new LLMModel("gpt-4o", {
    maxTokens: 2048,
    temperature: 0.1,
    stream: true
  })

  const researcher = await Agent.initialize({
    llm,
    name: "researcher",
    description: `Your expertise is to find information.`,
    serverConfigs: [
      {
        name: "read_file_from_local_file_system",
        type: "stdio",
        command: "node",
        args: ['--loader', 'ts-node/esm', path.resolve(__dirname, '..', 'servers', 'readLocalFileSystem.ts'),]
      },
      {
        name: "search_web",
        type: "ws",
        url: createSmitheryUrl(
          "https://server.smithery.ai/exa/ws",
          {
            exaApiKey: "c3a314fb-50c5-44a2-8bf1-f4fb56ffe081"
          },
          "6063e0bb-f999-444f-9b98-b099817ce2a8"
        )
      }
    ],
  });

  const writer = await Agent.initialize({
    name: "writer",
    description: `Your expertise is to write information to a file.`,
    functions: [writeLocalSystem],
    llm,
  });

  const orchestrator = new Orchestrator({
    llm,
    agents: [researcher, writer],
  })

  const result = await orchestrator.generate('Search new latest developemnt about AI and write about it to `ai_research.md` on my local machine. no need to verify the result.');
  console.log(JSON.stringify(result))

  await researcher.close()
  await writer.close()
}

runOrchestrator().catch(console.error);