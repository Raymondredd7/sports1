'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Match, Prediction } from '../../../types';
import { getMatchDetails } from '../../../services/footballApi';
import { generatePrediction } from '../../../services/predictionService';
import { format } from 'date-fns';
import Image from 'next/image';

export default function MatchPage() {
  const params = useParams();
  const [match, setMatch] = useState<Match | null>(null);
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const matchId = Number(params.id);
        const matchData = await getMatchDetails(matchId);
        if (matchData) {
          setMatch(matchData);
          const predictionData = await generatePrediction(matchData);
          setPrediction(predictionData);
        }
      } catch (err) {
        setError('Failed to fetch match details');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !match || !prediction) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">{error || 'Match not found'}</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-gray-500">
              {match.competition.name}
            </div>
            <div className="text-sm text-gray-500">
              {format(new Date(match.utcDate), 'MMM d, HH:mm')}
            </div>
          </div>

          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Image
                src={match.homeTeam.crest}
                alt={match.homeTeam.name}
                width={64}
                height={64}
                className="w-16 h-16"
              />
              <span className="text-xl font-bold">{match.homeTeam.name}</span>
            </div>
            <div className="text-2xl font-bold text-gray-500">vs</div>
            <div className="flex items-center space-x-4">
              <span className="text-xl font-bold">{match.awayTeam.name}</span>
              <Image
                src={match.awayTeam.crest}
                alt={match.awayTeam.name}
                width={64}
                height={64}
                className="w-16 h-16"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Match Predictions</h3>
              <div className="space-y-2">
                <p><span className="font-medium">Winner:</span> {prediction.matchWinner}</p>
                <p><span className="font-medium">Both Teams to Score:</span> {prediction.bothTeamsToScore ? 'Yes' : 'No'}</p>
                <p><span className="font-medium">Over/Under 2.5:</span> {prediction.overUnder}</p>
                <p><span className="font-medium">Correct Score:</span> {prediction.correctScore}</p>
                <p><span className="font-medium">HT/FT:</span> {prediction.halfTimeFullTime}</p>
                <p><span className="font-medium">First to Score:</span> {prediction.firstTeamToScore}</p>
                <p><span className="font-medium">Total Goals:</span> {prediction.totalGoals}</p>
                <p><span className="font-medium">Corner Count:</span> {prediction.cornerCount}</p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Betting Tips</h3>
              <div className="space-y-2">
                <p><span className="font-medium">Safest Pick:</span> {prediction.bettingTips.safestPick}</p>
                <p><span className="font-medium">Bold Prediction:</span> {prediction.bettingTips.boldPrediction}</p>
                <p><span className="font-medium">Odds Range:</span> {prediction.bettingTips.oddsRange}</p>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">Match Analysis</h3>
            <p className="text-gray-700 whitespace-pre-line">{prediction.analysis}</p>
          </div>
        </div>
      </div>
    </main>
  );
} 