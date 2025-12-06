import type { VercelRequest, VercelResponse } from '@vercel/node';
import OpenAI from 'openai';

// Stage definitions for context-aware prompts
const FOUNDRY_STAGES = {
    ignite: { name: 'Ignite', focus: 'Turn curiosity into a clear, structured idea. Help clarify core vision and identify the problem being solved.' },
    explore: { name: 'Explore', focus: 'Discover patterns, opportunities, and market spaces. Help map the landscape and identify key opportunities.' },
    empathize: { name: 'Empathize', focus: 'Understand users deeply before building. Help identify user pain points and needs.' },
    differentiate: { name: 'Differentiate', focus: 'Analyze competitors and find unique positioning. Help carve out competitive advantage.' },
    architect: { name: 'Architect', focus: 'Define product foundation, features, and logic. Help structure the product architecture.' },
    validate: { name: 'Validate', focus: 'Gather insights, measure interest, and prove demand. Help with validation strategies.' },
    construct: { name: 'Construct', focus: 'Plan sprints, map systems, and structure the build. Help with development roadmap.' },
    align: { name: 'Align', focus: 'Sync strategy, messaging, and design for launch. Help align all elements before market entry.' },
};

const LAUNCH_STAGES = {
    research: { name: 'Research', focus: 'Understand audience, market, and competitive landscape. Help with market research and insights.' },
    position: { name: 'Position', focus: 'Define unique value proposition and brand positioning. Help craft compelling positioning.' },
    strategy: { name: 'Strategy', focus: 'Craft go-to-market strategy and launch roadmap. Help plan market entry strategy.' },
    campaigns: { name: 'Campaigns', focus: 'Plan multi-channel campaigns and content initiatives. Help design campaign strategies.' },
    messaging: { name: 'Messaging', focus: 'Develop compelling copy and brand messaging. Help craft persuasive messaging frameworks.' },
    channels: { name: 'Channels', focus: 'Optimize distribution channels and audience touchpoints. Help select and optimize channels.' },
    execute: { name: 'Execute', focus: 'Launch campaigns and measure performance. Help with execution and real-time optimization.' },
    scale: { name: 'Scale', focus: 'Iterate, optimize, and scale what works. Help identify and scale winning strategies.' },
};

// GPT-4o-mini pricing (as of December 2024)
const PRICING = {
    'gpt-4o-mini': {
        input: (0.15 / 1_000_000) * 90,  // Cost per input token in INR
        output: (0.60 / 1_000_000) * 90,  // Cost per output token in INR
    }
};

// Helper function to calculate cost
const calculateCost = (model: string, inputTokens: number, outputTokens: number): number => {
    const pricing = PRICING[model as keyof typeof PRICING];
    if (!pricing) return 0;
    return (inputTokens * pricing.input) + (outputTokens * pricing.output);
};

// Helper function to format currency in INR
const formatCost = (cost: number): string => {
    return `₹${cost.toFixed(4)}`;
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Handle CORS
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { messages, stage, stageId } = req.body;

        if (!messages || !Array.isArray(messages)) {
            res.status(400).json({ error: 'Invalid messages format' });
            return;
        }

        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });

        const model = 'gpt-4o-mini';

        // Determine which OS and get stage details
        const stageKey = (stageId?.toLowerCase() || '') as string;
        const foundryStage = FOUNDRY_STAGES[stageKey as keyof typeof FOUNDRY_STAGES];
        const launchStage = LAUNCH_STAGES[stageKey as keyof typeof LAUNCH_STAGES];
        const isFoundryOS = !!foundryStage;
        const stageDetails = foundryStage || launchStage;

        console.log(`[${isFoundryOS ? 'FoundryOS' : 'LaunchOS'}] Stage: ${stage} (${stageId}) | Messages: ${messages.length} | Model: ${model}`);

        // Create specialized system prompt based on OS and stage
        let systemPrompt;

        if (isFoundryOS && stageDetails) {
            systemPrompt = {
                role: 'system',
                content: `You are an expert startup advisor helping a founder work through the "${stage}" stage of FoundryOS - the product development operating system.

**Your Role**: Act as a seasoned startup founder and product expert who's built multiple successful companies.

**Current Stage Context**: ${stageDetails.focus}

**Your Personality**:
- Be conversational and natural - like a knowledgeable co-founder, not a consultant
- Keep responses SHORT (2-4 sentences max unless asked for detail)
- Ask ONE insightful follow-up question at a time
- Be encouraging and supportive, but also challenge assumptions when needed
- Avoid bullet points and formal lists unless specifically requested
- Sound human - use contractions, be warm and direct

**Your Expertise**:
- Product development and validation
- User research and empathy mapping
- Competitive analysis and differentiation
- Technical architecture and feature planning
- MVP strategy and iteration

Help them make real progress on ${stage}. Get straight to actionable insights.`
            };
        } else if (stageDetails) {
            systemPrompt = {
                role: 'system',
                content: `You are an expert marketing strategist and growth advisor helping a founder work through the "${stage}" stage of LaunchOS - the go-to-market operating system.

**Your Role**: Act as a seasoned marketing executive and growth expert who's launched multiple successful products.

**Current Stage Context**: ${stageDetails.focus}

**Your Personality**:
- Be conversational and natural - like a trusted marketing co-founder, not an agency
- Keep responses SHORT (2-4 sentences max unless asked for detail)
- Ask ONE strategic follow-up question at a time
- Be encouraging and data-driven
- Avoid bullet points and formal lists unless specifically requested
- Sound human - use contractions, be warm and direct

**Your Expertise**:
- Market research and audience insights
- Brand positioning and messaging
- Multi-channel marketing strategy
- Campaign planning and execution
- Growth metrics and optimization
- Content strategy and copywriting

Help them build momentum for ${stage}. Focus on actionable marketing strategies.`
            };
        } else {
            systemPrompt = {
                role: 'system',
                content: `You are a helpful startup advisor helping someone work through the "${stage}" stage.

Be conversational, concise (2-4 sentences), and ask one question at a time. Keep it natural and actionable.`
            };
        }

        const messagesWithSystem = [systemPrompt, ...messages];

        try {
            const completion = await openai.chat.completions.create({
                model: model,
                messages: messagesWithSystem,
                temperature: 0.7,
                max_tokens: 200,
            });

            const reply = completion.choices[0].message;
            const inputTokens = completion.usage?.prompt_tokens || 0;
            const outputTokens = completion.usage?.completion_tokens || 0;
            const totalTokens = completion.usage?.total_tokens || 0;

            // Calculate cost for this request
            const requestCost = calculateCost(model, inputTokens, outputTokens);

            console.log(`Cost breakdown - Input: ${formatCost(inputTokens * PRICING[model as keyof typeof PRICING].input)}, Output: ${formatCost(outputTokens * PRICING[model as keyof typeof PRICING].output)}, Total: ${formatCost(requestCost)}`);

            res.json({
                reply,
                modelUsed: model,
                usage: completion.usage,
                cost: {
                    thisRequest: requestCost,
                    currency: 'INR'
                }
            });
        } catch (openaiError: any) {
            if (openaiError.status === 429 || openaiError.code === 'insufficient_quota') {
                console.error('OpenAI quota exceeded. Please add credits to your account.');
                res.json({
                    reply: {
                        role: 'assistant',
                        content: `I'm currently unable to connect to OpenAI due to insufficient credits. Please add credits and try again.`
                    },
                    modelUsed: 'error-fallback',
                    usage: null,
                    error: 'quota_exceeded'
                });
            } else {
                throw openaiError;
            }
        }

    } catch (error: any) {
        console.error('Error in chat handler:', error);
        res.status(500).json({ error: 'Failed to generate response', details: error.message });
    }
}