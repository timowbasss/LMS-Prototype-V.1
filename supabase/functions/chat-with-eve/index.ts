const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ChatRequest {
  messages: ChatMessage[];
  userContext?: {
    courses?: string[];
    assignments?: string[];
    grades?: any;
  };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { messages, userContext }: ChatRequest = await req.json();

    // Get OpenAI API key from environment
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Create system prompt with user context
    const systemPrompt = `You are Eve, an AI study assistant for the Ivy STEM Learning Hub. You help students with their coursework, study planning, and academic questions.

User Context:
${userContext?.courses ? `Enrolled Courses: ${userContext.courses.join(', ')}` : ''}
${userContext?.assignments ? `Current Assignments: ${userContext.assignments.join(', ')}` : ''}
${userContext?.grades ? `Recent Performance: ${JSON.stringify(userContext.grades)}` : ''}

Guidelines:
- Be helpful, encouraging, and supportive
- Provide specific study advice and strategies
- Help with assignment planning and time management
- Answer academic questions across STEM subjects
- Suggest study techniques and resources
- Keep responses concise but informative
- Use a friendly, professional tone
- If you don't know something, admit it and suggest alternatives

Focus on being a practical study companion that helps students succeed academically.`;

    const chatMessages: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
      ...messages.slice(-10) // Keep last 10 messages for context
    ];

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: chatMessages,
        max_tokens: 500,
        temperature: 0.7,
        stream: false
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0]?.message?.content;

    if (!aiResponse) {
      throw new Error('No response from AI');
    }

    return new Response(
      JSON.stringify({ 
        message: aiResponse,
        success: true 
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );

  } catch (error) {
    console.error('Chat error:', error);
    
    // Fallback response if AI service fails
    const fallbackResponse = "I'm having trouble connecting to my AI service right now. However, I'm still here to help! Could you try rephrasing your question, or let me know what specific topic you'd like assistance with? I can help with study planning, assignment organization, or general academic guidance.";
    
    return new Response(
      JSON.stringify({ 
        message: fallbackResponse,
        success: false,
        error: 'AI service temporarily unavailable'
      }),
      {
        status: 200, // Return 200 to show fallback message
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  }
});