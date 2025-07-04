
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct_answer: number;
  explanation: string;
}

interface AnalysisRequest {
  questions: QuizQuestion[];
  userAnswers: number[];
  categoryName: string;
  score: number;
  totalQuestions: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { questions, userAnswers, categoryName, score, totalQuestions }: AnalysisRequest = await req.json();

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not found');
    }

    // Analyze incorrect answers
    const incorrectAnswers = questions.filter((question, index) => 
      userAnswers[index] !== question.correct_answer
    ).map((question, index) => ({
      question: question.question,
      correctAnswer: question.options[question.correct_answer],
      userAnswer: userAnswers[questions.indexOf(question)] >= 0 ? question.options[userAnswers[questions.indexOf(question)]] : 'Not answered',
      explanation: question.explanation
    }));

    const percentage = Math.round((score / totalQuestions) * 100);

    const prompt = `
You are an expert Computer Science tutor analyzing a student's quiz performance.

Quiz Category: ${categoryName}
Score: ${score}/${totalQuestions} (${percentage}%)

Incorrect Answers Analysis:
${incorrectAnswers.map((item, i) => `
${i + 1}. Question: ${item.question}
   Correct Answer: ${item.correctAnswer}
   Student's Answer: ${item.userAnswer}
   Explanation: ${item.explanation}
`).join('')}

Based on this performance, provide a JSON response with the following structure:
{
  "weakAreas": [
    {
      "topic": "specific topic name",
      "description": "brief explanation of why this is weak",
      "priority": "high|medium|low"
    }
  ],
  "studyRecommendations": [
    {
      "topic": "topic name",
      "tips": ["tip1", "tip2", "tip3"],
      "resources": [
        {
          "title": "resource title",
          "url": "https://example.com",
          "type": "tutorial|video|documentation|article"
        }
      ]
    }
  ],
  "overallFeedback": "encouraging feedback with specific improvement suggestions",
  "nextSteps": ["actionable step 1", "actionable step 2"]
}

Focus on:
1. Identifying specific CS concepts the student struggles with
2. Providing practical, actionable study tips
3. Recommending high-quality, free learning resources (MDN, YouTube channels like Traversy Media, freeCodeCamp, official documentation)
4. Being encouraging but honest about areas needing improvement
5. Keeping recommendations focused and not overwhelming

Provide ONLY the JSON response, no additional text.
`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an expert Computer Science tutor. Always respond with valid JSON only.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const analysis = JSON.parse(data.choices[0].message.content);

    console.log('AI Analysis completed:', analysis);

    return new Response(JSON.stringify(analysis), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in analyze-quiz function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
