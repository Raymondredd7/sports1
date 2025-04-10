import OpenAI from 'openai';
import { Match, Prediction } from '../types';

// Check if API key is available
const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
const openai = apiKey ? new OpenAI({ apiKey }) : null;

// Generate a mock prediction based on team names
const generateMockPrediction = (match: Match): Prediction => {
  // Simple algorithm to generate mock predictions
  const homeName = match.homeTeam.name.toLowerCase();
  const awayName = match.awayTeam.name.toLowerCase();
  
  // Basic factors for mock prediction
  const homeFactor = homeName.length % 10;
  const awayFactor = awayName.length % 10;
  const total = homeFactor + awayFactor + 1;
  
  const homeWin = Math.round((homeFactor / total) * 100);
  const awayWin = Math.round((awayFactor / total) * 100);
  const draw = 100 - homeWin - awayWin;

  // Generate random probabilities for other predictions
  const randomProb = () => Math.floor(Math.random() * 100);
  const randomRange = (min: number, max: number) => 
    `${Math.floor(Math.random() * (max - min + 1) + min)}-${Math.floor(Math.random() * (max - min + 1) + min)}`;

  return {
    matchWinner: {
      home: homeWin,
      draw: draw,
      away: awayWin,
    },
    btts: {
      yes: randomProb(),
      no: 100 - randomProb(),
    },
    overUnder: {
      over: randomProb(),
      under: 100 - randomProb(),
    },
    totalGoals: {
      range: randomRange(0, 5),
      mostLikely: Math.floor(Math.random() * 4),
    },
    doubleChance: {
      homeOrDraw: randomProb(),
      homeOrAway: randomProb(),
      drawOrAway: randomProb(),
    },
    correctScore: {
      mostLikely: `${Math.floor(Math.random() * 3)}-${Math.floor(Math.random() * 3)}`,
      alternatives: [
        `${Math.floor(Math.random() * 3)}-${Math.floor(Math.random() * 3)}`,
        `${Math.floor(Math.random() * 3)}-${Math.floor(Math.random() * 3)}`,
      ],
    },
    halfTimeFullTime: {
      mostLikely: `${Math.random() > 0.5 ? 'H' : 'A'}/${Math.random() > 0.5 ? 'H' : 'A'}`,
      probability: randomProb(),
    },
    firstTeamToScore: {
      home: randomProb(),
      away: randomProb(),
      none: 100 - randomProb() - randomProb(),
    },
    cornerCount: {
      range: randomRange(5, 15),
      mostLikely: Math.floor(Math.random() * 10) + 5,
    },
    cards: {
      yellowCards: {
        range: randomRange(2, 6),
        mostLikely: Math.floor(Math.random() * 4) + 2,
      },
      redCards: {
        range: randomRange(0, 2),
        mostLikely: Math.floor(Math.random() * 2),
      },
    },
    confidence: 50,
    analysis: `Mock prediction: Based on team name analysis, ${match.homeTeam.name} has a ${homeWin}% chance of winning, while ${match.awayTeam.name} has a ${awayWin}% chance. This is a mock prediction for demonstration purposes.`,
  };
};

export const getMatchPrediction = async (match: Match): Promise<Prediction> => {
  // If no OpenAI API key is available, return mock predictions
  if (!openai) {
    console.warn('OpenAI API key not found. Using mock predictions.');
    return generateMockPrediction(match);
  }

  try {
    const prompt = `Analyze the upcoming football match between ${match.homeTeam.name} and ${match.awayTeam.name} in the ${match.competition.name}.
    Consider their recent form, head-to-head record, and other relevant factors.
    Provide detailed predictions in the following format:

    Match Winner Probabilities:
    - Home Win: [0-100]%
    - Draw: [0-100]%
    - Away Win: [0-100]%

    Both Teams to Score (BTTS):
    - Yes: [0-100]%
    - No: [0-100]%

    Over/Under 2.5 Goals:
    - Over: [0-100]%
    - Under: [0-100]%

    Total Goals:
    - Range: [X-Y]
    - Most Likely: [number]

    Double Chance:
    - Home or Draw: [0-100]%
    - Home or Away: [0-100]%
    - Draw or Away: [0-100]%

    Correct Score:
    - Most Likely: [X-Y]
    - Alternative Scores: [X-Y, X-Y]

    Half-Time/Full-Time:
    - Most Likely: [H/D/A-H/D/A]
    - Probability: [0-100]%

    First Team to Score:
    - Home: [0-100]%
    - Away: [0-100]%
    - None: [0-100]%

    Corner Count:
    - Range: [X-Y]
    - Most Likely: [number]

    Cards:
    - Yellow Cards Range: [X-Y]
    - Most Likely Yellow Cards: [number]
    - Red Cards Range: [X-Y]
    - Most Likely Red Cards: [number]

    Confidence Level: [0-100]%

    Analysis: [2-3 paragraphs explaining the predictions]`;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-3.5-turbo",
    });

    const response = completion.choices[0].message.content;
    
    // Parse the response to extract all predictions
    // This is a simplified version - in a real app, you'd want more robust parsing
    const predictions = response?.split('\n').reduce((acc: any, line: string) => {
      if (line.includes('Home Win:')) acc.matchWinner.home = parseInt(line.match(/\d+/)?.[0] || '33');
      if (line.includes('Draw:')) acc.matchWinner.draw = parseInt(line.match(/\d+/)?.[0] || '33');
      if (line.includes('Away Win:')) acc.matchWinner.away = parseInt(line.match(/\d+/)?.[0] || '34');
      // ... parse other predictions similarly
      return acc;
    }, generateMockPrediction(match));

    return predictions;
  } catch (error) {
    console.error('Error getting prediction:', error);
    // Return mock prediction in case of error
    return generateMockPrediction(match);
  }
}; 