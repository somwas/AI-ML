import { createReactAgent } from '@langchain/langgraph/prebuilt';
import { initChatModel } from 'langchain/chat_models/universal';
import { tool } from '@langchain/core/tools';
import { z } from 'zod';

const getWeather = tool(
    async (input : { city: string }) => {
        return `It's sunny in ${input.city} today. You don't need an umbrella.`;
    },
    {
        name: 'getWeather',
        schema: z.object({
            city: z.string().describe('The name of the city to get the weather for.'),
        }),
        description: 'Get the current weather for a given city.',
    }
);

const llm = await initChatModel('gpt-3.5-turbo', {
    openAIApiKey: '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',
});

const agent = await createReactAgent({
    llm,
    tools: [ getWeather ],
    prompt: 'You are a helpful email assistant.',
});

//Run the agent
const result = await agent.invoke({
    messages: [{role: 'user', content: 'What is the weather in New York today, and should I carry an umbrella with me?'}],
});

console.log(result);