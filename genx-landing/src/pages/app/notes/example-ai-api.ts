/**
 * EXAMPLE: AI API Integration for Notes
 * 
 * This is a placeholder showing how to wire up your AI endpoint.
 * Replace the API endpoint and modify the request/response as needed.
 */

// Example 1: Using OpenAI API
export const callOpenAIAPI = async (noteContent: string) => {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that expands and enhances notes with insights and suggestions.',
          },
          {
            role: 'user',
            content: `Please expand on this note with insights, suggestions, and next steps:\n\n${noteContent}`,
          },
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    })

    const data = await response.json()
    return data.choices[0].message.content
  } catch (error) {
    console.error('OpenAI API Error:', error)
    throw error
  }
}

// Example 2: Using your backend API
export const callBackendAI = async (noteContent: string) => {
  try {
    const response = await fetch('/api/ai/enhance-note', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: noteContent }),
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()
    return data.response
  } catch (error) {
    console.error('Backend API Error:', error)
    throw error
  }
}

// Example 3: Using Anthropic Claude API
export const callClaudeAPI = async (noteContent: string) => {
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': import.meta.env.VITE_CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-opus-20240229',
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: `Please expand on this note with insights, suggestions, and next steps:\n\n${noteContent}`,
          },
        ],
      }),
    })

    const data = await response.json()
    return data.content[0].text
  } catch (error) {
    console.error('Claude API Error:', error)
    throw error
  }
}

/**
 * SETUP INSTRUCTIONS:
 * 
 * 1. Choose your AI provider (OpenAI, Claude, or your own backend)
 * 
 * 2. Add API key to .env.local:
 *    VITE_OPENAI_API_KEY=sk-...
 *    VITE_CLAUDE_API_KEY=sk-ant-...
 * 
 * 3. Update NotesLayout.tsx handleAskAI function:
 *    Replace: const response = await fetch('/api/ai', ...)
 *    With: const response = await callOpenAIAPI(selectedNote.content)
 * 
 * 4. Handle the response appropriately
 */
