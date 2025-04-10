import axios from 'axios';
import { Match } from '../types';

const API_KEY = process.env.NEXT_PUBLIC_FOOTBALL_API_KEY;
const API_URL = '/api/football'; // Using proxy endpoint

if (!API_KEY) {
  console.error('Football API key is not set. Please set NEXT_PUBLIC_FOOTBALL_API_KEY in your .env.local file');
}

const footballApi = axios.create({
  baseURL: API_URL,
  headers: {
    'X-Auth-Token': API_KEY,
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Add request interceptor for logging
footballApi.interceptors.request.use(
  (config) => {
    const url = config.url ? `${config.baseURL}${config.url}` : 'unknown';
    console.log('Making request to:', url);
    console.log('With headers:', config.headers);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for better error handling
footballApi.interceptors.response.use(
  (response) => {
    console.log('Response received:', {
      status: response.status,
      data: JSON.stringify(response.data, null, 2),
    });
    return response;
  },
  (error) => {
    if (error.response) {
      console.error('Football API Error Response:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers,
      });
    } else if (error.request) {
      console.error('Football API No Response. Request details:', {
        url: error.request.url,
        method: error.request.method,
        headers: error.request.headers,
      });
    } else {
      console.error('Football API Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export const getUpcomingMatches = async (): Promise<Match[]> => {
  try {
    console.log('Fetching matches with API URL:', API_URL);
    console.log('Using API Key:', API_KEY ? 'Present' : 'Missing');
    
    // Get today's date and 7 days from now
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);
    
    // Format dates for API
    const dateFrom = today.toISOString().split('T')[0];
    const dateTo = nextWeek.toISOString().split('T')[0];
    
    // Get matches for the next 7 days
    const response = await footballApi.get('/matches', {
      params: {
        status: 'SCHEDULED',
        competitions: 'PL,PD,SA,BL1,FL1', // Premier League, La Liga, Serie A, Bundesliga, Ligue 1
        dateFrom,
        dateTo,
      },
    });
    
    console.log('Full API response:', JSON.stringify(response.data, null, 2));
    
    // If no matches found, try getting matches from individual competitions
    if (!response.data.matches || response.data.matches.length === 0) {
      console.log('No matches found in general endpoint, trying individual competitions...');
      
      const competitions = ['PL', 'PD', 'SA', 'BL1', 'FL1'];
      const allMatches: Match[] = [];
      
      for (const comp of competitions) {
        try {
          const compResponse = await footballApi.get(`/competitions/${comp}/matches`, {
            params: {
              status: 'SCHEDULED',
              dateFrom,
              dateTo,
            },
          });
          
          if (compResponse.data.matches) {
            allMatches.push(...compResponse.data.matches);
          }
        } catch (error) {
          console.error(`Error fetching matches for competition ${comp}:`, error);
        }
      }
      
      return allMatches;
    }
    
    return response.data.matches || [];
  } catch (error) {
    console.error('Error fetching matches:', error);
    // Return mock data for testing if API fails
    return [
      {
        id: 1,
        competition: {
          id: 2021,
          name: 'Premier League',
          code: 'PL',
          emblem: 'https://crests.football-data.org/PL.png',
        },
        homeTeam: {
          id: 57,
          name: 'Arsenal FC',
          shortName: 'Arsenal',
          crest: 'https://crests.football-data.org/57.png',
        },
        awayTeam: {
          id: 61,
          name: 'Chelsea FC',
          shortName: 'Chelsea',
          crest: 'https://crests.football-data.org/61.png',
        },
        utcDate: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
        status: 'SCHEDULED',
        score: {
          fullTime: {
            home: null,
            away: null,
          },
          halfTime: {
            home: null,
            away: null,
          },
        },
      },
    ];
  }
};

export const getMatchDetails = async (matchId: number): Promise<Match | null> => {
  try {
    const response = await footballApi.get(`/matches/${matchId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching match details:', error);
    return null;
  }
}; 