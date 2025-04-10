'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getMatchDetails } from '../../../services/footballApi';
import { getMatchPrediction } from '../../../services/predictionService';
import { Match, Prediction } from '../../../types';
import Image from 'next/image';

const LEAGUES = [
  // Top 5 European Leagues
  { id: 'PL', name: '🏴󠁧󠁢󠁥󠁮󠁧󠁿 Premier League' },
  { id: 'PD', name: '🇪🇸 La Liga' },
  { id: 'BL1', name: '🇩🇪 Bundesliga' },
  { id: 'SA', name: '🇮🇹 Serie A' },
  { id: 'FL1', name: '🇫🇷 Ligue 1' },

  // European Competitions
  { id: 'CL', name: '🏆 Champions League' },
  { id: 'EL', name: '🏆 Europa League' },
  { id: 'ECL', name: '🏆 Europa Conference League' },
  { id: 'EC', name: '🏆 European Championship' },
  { id: 'WC', name: '🌍 World Cup' },

  // Other European Leagues
  { id: 'PPL', name: '🇵🇹 Primeira Liga' },
  { id: 'DED', name: '🇳🇱 Eredivisie' },
  { id: 'BSA', name: '🇧🇷 Brasileirão' },
  { id: 'CLI', name: '🏆 Copa Libertadores' },
  { id: 'CDR', name: '🏆 Copa del Rey' },
  { id: 'FAC', name: '🏆 FA Cup' },
  { id: 'DFB', name: '🏆 DFB Pokal' },
  { id: 'COI', name: '🏆 Coppa Italia' },

  // International Competitions
  { id: 'AFC', name: '🏆 AFC Champions League' },
  { id: 'CAF', name: '🏆 CAF Champions League' },
  { id: 'CONCACAF', name: '🏆 CONCACAF Champions League' },
  { id: 'OFC', name: '🏆 OFC Champions League' },

  // National Teams
  { id: 'EURO', name: '🏆 UEFA European Championship' },
  { id: 'COPA', name: '🏆 Copa América' },
  { id: 'AFCON', name: '🏆 Africa Cup of Nations' },
  { id: 'GOLD', name: '🏆 CONCACAF Gold Cup' },
  { id: 'ASIA', name: '🏆 AFC Asian Cup' },

  // Other Major Leagues
  { id: 'MLS', name: '🇺🇸 Major League Soccer' },
  { id: 'J1', name: '🇯🇵 J1 League' },
  { id: 'K1', name: '🇰🇷 K League 1' },
  { id: 'CSL', name: '🇨🇳 Chinese Super League' },
  { id: 'AUS', name: '🇦🇺 A-League' },
  { id: 'RPL', name: '🇷🇺 Russian Premier League' },
  { id: 'SPL', name: '🏴󠁧󠁢󠁳󠁣󠁴󠁿 Scottish Premiership' },
  { id: 'BUN', name: '🇧🇪 Belgian Pro League' },
  { id: 'SUP', name: '🇨🇭 Swiss Super League' },
  { id: 'AUT', name: '🇦🇹 Austrian Bundesliga' },
  { id: 'DNK', name: '🇩🇰 Danish Superliga' },
  { id: 'SWE', name: '🇸🇪 Allsvenskan' },
  { id: 'NOR', name: '🇳🇴 Eliteserien' },
  { id: 'FIN', name: '🇫🇮 Veikkausliiga' },
  { id: 'POL', name: '🇵🇱 Ekstraklasa' },
  { id: 'CZE', name: '🇨🇿 Czech Liga' },
  { id: 'SVK', name: '🇸🇰 Slovak Super Liga' },
  { id: 'HUN', name: '🇭🇺 NB I' },
  { id: 'ROU', name: '🇷🇴 Liga I' },
  { id: 'BUL', name: '🇧🇬 First League' },
  { id: 'CRO', name: '🇭🇷 HNL' },
  { id: 'SRB', name: '🇷🇸 Super Liga' },
  { id: 'GRE', name: '🇬🇷 Super League' },
  { id: 'TUR', name: '🇹🇷 Süper Lig' },
  { id: 'ISR', name: '🇮🇱 Ligat ha\'Al' },
  { id: 'RSA', name: '🇿🇦 Premier Soccer League' },
  { id: 'EGY', name: '🇪🇬 Egyptian Premier League' },
  { id: 'MEX', name: '🇲🇽 Liga MX' },
  { id: 'ARG', name: '🇦🇷 Liga Profesional' },
  { id: 'BRA', name: '🇧🇷 Brasileirão' },
  { id: 'CHL', name: '🇨🇱 Primera División' },
  { id: 'COL', name: '🇨🇴 Categoría Primera A' },
  { id: 'PER', name: '🇵🇪 Liga 1' },
  { id: 'URU', name: '🇺🇾 Primera División' },
  { id: 'VEN', name: '🇻🇪 Primera División' },
  { id: 'ECU', name: '🇪🇨 Serie A' },
  { id: 'PAR', name: '🇵🇾 Primera División' },
  { id: 'BOL', name: '🇧🇴 División Profesional' },
];

export default function MatchPage() {
  const params = useParams();
  const matchId = parseInt(params.id as string);
  
  const [match, setMatch] = useState<Match | null>(null);
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLeague, setSelectedLeague] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');

  useEffect(() => {
    const fetchMatchDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const matchData = await getMatchDetails(matchId);
        if (matchData) {
          setMatch(matchData);
          const predictionData = await getMatchPrediction(matchData);
          setPrediction(predictionData);
        } else {
          setError('Match not found');
        }
      } catch (err) {
        console.error('Error fetching match details:', err);
        setError('Failed to load match details');
      } finally {
        setLoading(false);
      }
    };

    fetchMatchDetails();
  }, [matchId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">Loading match details...</h2>
          </div>
        </div>
      </div>
    );
  }

  if (error || !match) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-red-600">{error || 'Match not found'}</h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              placeholder="Search by team name..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={selectedLeague}
              onChange={(e) => setSelectedLeague(e.target.value)}
            >
              <option value="">All Leagues</option>
              {LEAGUES.map(league => (
                <option key={league.id} value={league.id}>{league.name}</option>
              ))}
            </select>
            <input
              type="date"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6">
            {/* Match Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <Image
                  src={match.competition.emblem}
                  alt={match.competition.name}
                  width={32}
                  height={32}
                  className="rounded"
                />
                <span className="text-lg font-semibold text-gray-900">
                  {match.competition.name}
                </span>
              </div>
              <span className="text-sm text-gray-500">
                {new Date(match.utcDate).toLocaleDateString()} at{' '}
                {new Date(match.utcDate).toLocaleTimeString()}
              </span>
            </div>

            {/* Teams */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <Image
                  src={match.homeTeam.crest}
                  alt={match.homeTeam.name}
                  width={64}
                  height={64}
                  className="rounded"
                />
                <div>
                  <h3 className="text-xl font-bold">{match.homeTeam.name}</h3>
                  <p className="text-sm text-gray-500">{match.homeTeam.shortName}</p>
                </div>
              </div>

              <div className="text-2xl font-bold text-gray-900">VS</div>

              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <h3 className="text-xl font-bold">{match.awayTeam.name}</h3>
                  <p className="text-sm text-gray-500">{match.awayTeam.shortName}</p>
                </div>
                <Image
                  src={match.awayTeam.crest}
                  alt={match.awayTeam.name}
                  width={64}
                  height={64}
                  className="rounded"
                />
              </div>
            </div>

            {/* Predictions */}
            {prediction && (
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="text-xl font-bold mb-6">AI Predictions</h3>
                
                {/* Match Winner */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold mb-3">Match Winner</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-sm font-medium text-gray-600">Home Win</div>
                      <div className="text-2xl font-bold text-blue-600">{prediction.matchWinner.home}%</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-sm font-medium text-gray-600">Draw</div>
                      <div className="text-2xl font-bold text-gray-600">{prediction.matchWinner.draw}%</div>
                    </div>
                    <div className="text-center p-4 bg-red-50 rounded-lg">
                      <div className="text-sm font-medium text-gray-600">Away Win</div>
                      <div className="text-2xl font-bold text-red-600">{prediction.matchWinner.away}%</div>
                    </div>
                  </div>
                </div>

                {/* BTTS and Over/Under */}
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div>
                    <h4 className="text-lg font-semibold mb-3">Both Teams to Score</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-sm font-medium text-gray-600">Yes</div>
                        <div className="text-xl font-bold text-green-600">{prediction.btts.yes}%</div>
                      </div>
                      <div className="text-center p-4 bg-red-50 rounded-lg">
                        <div className="text-sm font-medium text-gray-600">No</div>
                        <div className="text-xl font-bold text-red-600">{prediction.btts.no}%</div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold mb-3">Over/Under 2.5 Goals</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-sm font-medium text-gray-600">Over</div>
                        <div className="text-xl font-bold text-green-600">{prediction.overUnder.over}%</div>
                      </div>
                      <div className="text-center p-4 bg-red-50 rounded-lg">
                        <div className="text-sm font-medium text-gray-600">Under</div>
                        <div className="text-xl font-bold text-red-600">{prediction.overUnder.under}%</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Total Goals and Double Chance */}
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div>
                    <h4 className="text-lg font-semibold mb-3">Total Goals</h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-center">
                        <div className="text-sm text-gray-600">Range</div>
                        <div className="text-xl font-bold">{prediction.totalGoals.range}</div>
                        <div className="text-sm text-gray-600 mt-2">Most Likely</div>
                        <div className="text-xl font-bold">{prediction.totalGoals.mostLikely}</div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold mb-3">Double Chance</h4>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-xs font-medium text-gray-600">1X</div>
                        <div className="text-lg font-bold text-blue-600">{prediction.doubleChance.homeOrDraw}%</div>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <div className="text-xs font-medium text-gray-600">12</div>
                        <div className="text-lg font-bold text-purple-600">{prediction.doubleChance.homeOrAway}%</div>
                      </div>
                      <div className="text-center p-3 bg-red-50 rounded-lg">
                        <div className="text-xs font-medium text-gray-600">X2</div>
                        <div className="text-lg font-bold text-red-600">{prediction.doubleChance.drawOrAway}%</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Correct Score and HT/FT */}
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div>
                    <h4 className="text-lg font-semibold mb-3">Correct Score</h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-center mb-2">
                        <div className="text-sm text-gray-600">Most Likely</div>
                        <div className="text-xl font-bold">{prediction.correctScore.mostLikely}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-gray-600">Alternatives</div>
                        <div className="text-sm font-medium">
                          {prediction.correctScore.alternatives.join(', ')}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold mb-3">Half-Time/Full-Time</h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-center">
                        <div className="text-sm text-gray-600">Most Likely</div>
                        <div className="text-xl font-bold">{prediction.halfTimeFullTime.mostLikely}</div>
                        <div className="text-sm text-gray-600 mt-2">Probability</div>
                        <div className="text-xl font-bold">{prediction.halfTimeFullTime.probability}%</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* First Team to Score and Corner Count */}
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div>
                    <h4 className="text-lg font-semibold mb-3">First Team to Score</h4>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-xs font-medium text-gray-600">Home</div>
                        <div className="text-lg font-bold text-blue-600">{prediction.firstTeamToScore.home}%</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-xs font-medium text-gray-600">None</div>
                        <div className="text-lg font-bold text-gray-600">{prediction.firstTeamToScore.none}%</div>
                      </div>
                      <div className="text-center p-3 bg-red-50 rounded-lg">
                        <div className="text-xs font-medium text-gray-600">Away</div>
                        <div className="text-lg font-bold text-red-600">{prediction.firstTeamToScore.away}%</div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold mb-3">Corner Count</h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-center">
                        <div className="text-sm text-gray-600">Range</div>
                        <div className="text-xl font-bold">{prediction.cornerCount.range}</div>
                        <div className="text-sm text-gray-600 mt-2">Most Likely</div>
                        <div className="text-xl font-bold">{prediction.cornerCount.mostLikely}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Cards */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold mb-3">Cards</h4>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h5 className="text-sm font-medium text-gray-600 mb-2">Yellow Cards</h5>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-center">
                          <div className="text-sm text-gray-600">Range</div>
                          <div className="text-xl font-bold">{prediction.cards.yellowCards.range}</div>
                          <div className="text-sm text-gray-600 mt-2">Most Likely</div>
                          <div className="text-xl font-bold">{prediction.cards.yellowCards.mostLikely}</div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h5 className="text-sm font-medium text-gray-600 mb-2">Red Cards</h5>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-center">
                          <div className="text-sm text-gray-600">Range</div>
                          <div className="text-xl font-bold">{prediction.cards.redCards.range}</div>
                          <div className="text-sm text-gray-600 mt-2">Most Likely</div>
                          <div className="text-xl font-bold">{prediction.cards.redCards.mostLikely}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Analysis */}
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <h4 className="text-lg font-semibold mb-3">Analysis</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-700">{prediction.analysis}</p>
                    <div className="mt-4 text-sm text-gray-500">
                      Confidence Level: {prediction.confidence}%
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Match Details */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="text-xl font-bold mb-4">Match Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <p className="font-medium">{match.status}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Stage</p>
                  <p className="font-medium">{match.stage || 'Regular Season'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Matchday</p>
                  <p className="font-medium">{match.matchday}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Last Updated</p>
                  <p className="font-medium">
                    {new Date(match.lastUpdated).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 