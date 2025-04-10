export interface Team {
  id: number;
  name: string;
  shortName: string;
  crest: string;
  tla?: string;
}

export interface Competition {
  id: number;
  name: string;
  code: string;
  type: string;
  emblem: string;
}

export interface Score {
  winner: string | null;
  duration: string;
  fullTime: {
    home: number | null;
    away: number | null;
  };
  halfTime: {
    home: number | null;
    away: number | null;
  };
}

export interface Match {
  id: number;
  utcDate: string;
  status: string;
  matchday: number;
  stage: string;
  group: string | null;
  lastUpdated: string;
  homeTeam: Team;
  awayTeam: Team;
  score: Score;
  competition: Competition;
  area?: {
    id: number;
    name: string;
    code: string;
    flag: string;
  };
  season?: {
    id: number;
    startDate: string;
    endDate: string;
    currentMatchday: number;
    winner: string | null;
  };
  odds?: {
    msg: string;
  };
  referees?: any[];
}

export interface Prediction {
  matchWinner: {
    home: number;
    draw: number;
    away: number;
  };
  btts: {
    yes: number;
    no: number;
  };
  overUnder: {
    over: number;
    under: number;
  };
  totalGoals: {
    range: string;
    mostLikely: number;
  };
  doubleChance: {
    homeOrDraw: number;
    homeOrAway: number;
    drawOrAway: number;
  };
  correctScore: {
    mostLikely: string;
    alternatives: string[];
  };
  halfTimeFullTime: {
    mostLikely: string;
    probability: number;
  };
  firstTeamToScore: {
    home: number;
    away: number;
    none: number;
  };
  cornerCount: {
    range: string;
    mostLikely: number;
  };
  cards: {
    yellowCards: {
      range: string;
      mostLikely: number;
    };
    redCards: {
      range: string;
      mostLikely: number;
    };
  };
  confidence: number;
  analysis: string;
} 