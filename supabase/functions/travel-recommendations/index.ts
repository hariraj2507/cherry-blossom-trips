import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

interface TripRequest {
  travelerName?: string;
  fromLocation?: string;
  destination: string;
  startDate: string;
  endDate: string;
  interests: string[];
  budget: number;
  currency: string;
  travelers: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { travelerName, fromLocation, destination, startDate, endDate, interests, budget, currency, travelers } = await req.json() as TripRequest;

    console.log('Generating travel recommendations for:', destination);
    console.log('From:', fromLocation || 'Not specified');
    console.log('Traveler:', travelerName || 'Anonymous');
    console.log('Budget:', budget, currency);
    console.log('Interests:', interests);

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const tripDays = Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1;

    const systemPrompt = `You are an expert travel advisor specializing in personalized trip planning. You analyze budgets realistically and provide honest assessments.

You must respond with a valid JSON object only, no additional text. The JSON must follow this exact structure:
{
  "budgetAnalysis": {
    "feasibility": "feasible" | "too_low" | "too_high",
    "dailyBudgetPerPerson": number,
    "estimatedTotalCost": number,
    "estimatedTransportFromOrigin": number (if origin provided, estimate transport cost),
    "message": "string explaining the budget situation",
    "adjustmentSuggestions": ["array of suggestions to adjust if budget is not feasible"]
  },
  "recommendations": {
    "attractions": [
      {
        "name": "string",
        "description": "string",
        "estimatedCost": number,
        "duration": "string",
        "bestTime": "string",
        "imageUrl": "string (a relevant Unsplash image URL for this attraction)"
      }
    ],
    "restaurants": [
      {
        "name": "string",
        "cuisine": "string",
        "priceRange": "budget" | "moderate" | "upscale",
        "averageMealCost": number,
        "specialty": "string"
      }
    ],
    "activities": [
      {
        "name": "string",
        "description": "string",
        "estimatedCost": number,
        "duration": "string",
        "difficulty": "easy" | "moderate" | "challenging",
        "imageUrl": "string (a relevant Unsplash image URL for this activity)"
      }
    ],
    "accommodations": [
      {
        "type": "string",
        "priceRange": "string per night",
        "description": "string",
        "amenities": ["array of amenities"]
      }
    ],
    "localExperiences": [
      {
        "name": "string",
        "description": "string",
        "estimatedCost": number,
        "culturalNote": "string",
        "imageUrl": "string (a relevant Unsplash image URL for this experience)"
      }
    ]
  },
  "suggestedBudgetBreakdown": {
    "accommodation": number,
    "food": number,
    "activities": number,
    "transport": number,
    "miscellaneous": number
  },
  "travelTips": ["array of helpful tips for this destination"]
}

For imageUrl fields, use Unsplash source URLs in the format: https://source.unsplash.com/800x600/?keyword1,keyword2
Replace keywords with relevant terms for the specific attraction/activity (e.g., "tokyo,temple" or "sushi,japan")`;

    const originInfo = fromLocation ? `Traveling from: ${fromLocation}` : '';
    const travelerInfo = travelerName ? `Traveler name: ${travelerName}` : '';
    
    const userPrompt = `Plan a trip to ${destination} for ${travelers} traveler(s).
${travelerInfo}
${originInfo}
Dates: ${startDate} to ${endDate} (${tripDays} days)
Total Budget: ${budget} ${currency}
Interests: ${interests.join(', ')}

Analyze if this budget is realistic for this destination and trip duration. Consider:
- Average accommodation costs
- Food and dining expenses
- Activity and attraction costs
- Local transportation
${fromLocation ? `- Estimated transport cost from ${fromLocation} to ${destination} (flights/trains)` : ''}
- Miscellaneous expenses

If the budget is too low, explain why and suggest either a higher budget or ways to reduce costs.
If the budget is too high for the destination, suggest premium experiences or additional activities.

Provide 4-5 recommendations per category, tailored to the interests and budget.
Include relevant Unsplash image URLs for attractions, activities, and local experiences.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.7,
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
          JSON.stringify({ error: 'AI service quota exceeded. Please try again later.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('No content in AI response');
    }

    console.log('AI Response received, parsing...');

    // Parse the JSON from the AI response
    let recommendations;
    try {
      // Clean the response - remove markdown code blocks if present
      let cleanContent = content.trim();
      if (cleanContent.startsWith('```json')) {
        cleanContent = cleanContent.slice(7);
      } else if (cleanContent.startsWith('```')) {
        cleanContent = cleanContent.slice(3);
      }
      if (cleanContent.endsWith('```')) {
        cleanContent = cleanContent.slice(0, -3);
      }
      recommendations = JSON.parse(cleanContent.trim());
    } catch (parseError) {
      console.error('Failed to parse AI response:', content);
      throw new Error('Failed to parse travel recommendations');
    }

    console.log('Recommendations generated successfully');

    return new Response(
      JSON.stringify({
        success: true,
        data: recommendations,
        tripDetails: {
          travelerName,
          fromLocation,
          destination,
          startDate,
          endDate,
          tripDays,
          travelers,
          budget,
          currency,
        },
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error generating recommendations:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
