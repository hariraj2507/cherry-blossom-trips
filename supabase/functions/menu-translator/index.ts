import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { image, dietaryPreferences = [] } = await req.json();
    
    if (!image) {
      throw new Error('No image provided');
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Build dietary context for the prompt
    const dietaryContext = dietaryPreferences.length > 0
      ? `User dietary requirements: ${dietaryPreferences.map((p: string) => {
          const labels: Record<string, string> = {
            vegetarian: 'Vegetarian (no meat or fish)',
            vegan: 'Vegan (no animal products)',
            jain: 'Jain (no root vegetables, no onion, no garlic)',
            glutenFree: 'Gluten-free',
            noOnionGarlic: 'No onion or garlic',
            nutAllergy: 'Nut allergy (avoid all nuts)',
            dairyFree: 'Dairy-free (no milk products)',
          };
          return labels[p] || p;
        }).join(', ')}`
      : 'No specific dietary restrictions';

    const systemPrompt = `You are an expert food translator and cultural guide specializing in menu translation. Your task is to:

1. Identify the language of the menu
2. Extract all food items from the image
3. Translate dish names to English
4. Provide detailed descriptions of each dish
5. Identify ingredients and dietary information
6. Flag dishes based on user's dietary requirements

${dietaryContext}

Respond in JSON format with this exact structure:
{
  "menuLanguage": "detected language",
  "restaurantType": "type of cuisine (e.g., South Indian, Japanese, etc.)",
  "culturalNotes": "optional brief cultural context about the cuisine or ordering customs",
  "dishes": [
    {
      "originalName": "dish name in original language",
      "translatedName": "English translation",
      "description": "what the dish is, how it's prepared, what it tastes like",
      "ingredients": ["main ingredient 1", "main ingredient 2"],
      "dietaryTags": ["vegetarian", "vegan", "contains-nuts", "gluten-free", "dairy-free", "non-vegetarian", "jain-friendly"],
      "spiceLevel": "mild|medium|spicy|very_spicy",
      "price": "price if visible on menu",
      "isCompatible": true/false based on user dietary requirements,
      "warnings": ["warning if dish conflicts with user's dietary needs"]
    }
  ]
}

Important:
- Set isCompatible to false if the dish violates ANY of the user's dietary requirements
- Add specific warnings explaining why a dish is incompatible
- For Tamil/South Indian menus, explain traditional dishes like Idli, Dosa, Sambar, etc.
- Include cultural eating tips in culturalNotes when relevant
- If you can't read part of the menu clearly, still include what you can identify`;

    console.log('Calling Lovable AI with menu image...');

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { 
            role: 'user', 
            content: [
              { type: 'text', text: 'Please analyze this menu image and translate all dishes:' },
              { 
                type: 'image_url', 
                image_url: { 
                  url: image 
                } 
              }
            ]
          }
        ],
        response_format: { type: 'json_object' },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI credits exhausted. Please add credits to continue.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      throw new Error(`AI service error: ${response.status}`);
    }

    const aiResponse = await response.json();
    console.log('AI response received');

    const content = aiResponse.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error('No response from AI');
    }

    // Parse the JSON response
    let translationResult;
    try {
      translationResult = JSON.parse(content);
    } catch (parseError) {
      console.error('Failed to parse AI response:', content);
      throw new Error('Failed to parse menu translation');
    }

    return new Response(
      JSON.stringify(translationResult),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Menu translator error:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Translation failed',
        dishes: []
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});