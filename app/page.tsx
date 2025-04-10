'use client';

import { useEffect, useState } from 'react';
import { getUpcomingMatches } from '../services/footballApi';
import { getMatchPrediction } from '../services/predictionService';
import { Match, Prediction } from '../types';
import Image from 'next/image';
import Link from 'next/link';
import LeagueFlag from './components/LeagueFlag';
import CustomSelect from './components/CustomSelect';

interface MatchWithPrediction extends Match {
  prediction?: Prediction;
}

const LEAGUES = [
  // Top 5 European Leagues
  { id: 'PL', name: 'Premier League' },
  { id: 'PD', name: 'La Liga' },
  { id: 'BL1', name: 'Bundesliga' },
  { id: 'SA', name: 'Serie A' },
  { id: 'FL1', name: 'Ligue 1' },

  // European Competitions
  { id: 'CL', name: 'Champions League' },
  { id: 'EL', name: 'Europa League' },
  { id: 'ECL', name: 'Europa Conference League' },
  { id: 'EC', name: 'European Championship' },
  { id: 'WC', name: 'World Cup' },

  // Other European Leagues
  { id: 'PPL', name: 'Primeira Liga' },
  { id: 'DED', name: 'Eredivisie' },
  { id: 'BSA', name: 'Brasileirão' },
  { id: 'CLI', name: 'Copa Libertadores' },
  { id: 'CDR', name: 'Copa del Rey' },
  { id: 'FAC', name: 'FA Cup' },
  { id: 'DFB', name: 'DFB Pokal' },
  { id: 'COI', name: 'Coppa Italia' },

  // International Competitions
  { id: 'AFC', name: 'AFC Champions League' },
  { id: 'CAF', name: 'CAF Champions League' },
  { id: 'CONCACAF', name: 'CONCACAF Champions League' },
  { id: 'OFC', name: 'OFC Champions League' },

  // National Teams
  { id: 'EURO', name: 'UEFA European Championship' },
  { id: 'COPA', name: 'Copa América' },
  { id: 'AFCON', name: 'Africa Cup of Nations' },
  { id: 'GOLD', name: 'CONCACAF Gold Cup' },
  { id: 'ASIA', name: 'AFC Asian Cup' },

  // Other Major Leagues
  { id: 'MLS', name: 'Major League Soccer' },
  { id: 'J1', name: 'J1 League' },
  { id: 'K1', name: 'K League 1' },
  { id: 'CSL', name: 'Chinese Super League' },
  { id: 'AUS', name: 'A-League' },
  { id: 'RPL', name: 'Russian Premier League' },
  { id: 'SPL', name: 'Scottish Premiership' },
  { id: 'BUN', name: 'Belgian Pro League' },
  { id: 'SUP', name: 'Swiss Super League' },
  { id: 'AUT', name: 'Austrian Bundesliga' },
  { id: 'DNK', name: 'Danish Superliga' },
  { id: 'SWE', name: 'Allsvenskan' },
  { id: 'NOR', name: 'Eliteserien' },
  { id: 'FIN', name: 'Veikkausliiga' },
  { id: 'POL', name: 'Ekstraklasa' },
  { id: 'CZE', name: 'Czech Liga' },
  { id: 'SVK', name: 'Slovak Super Liga' },
  { id: 'HUN', name: 'NB I' },
  { id: 'ROU', name: 'Liga I' },
  { id: 'BUL', name: 'First League' },
  { id: 'CRO', name: 'HNL' },
  { id: 'SRB', name: 'Super Liga' },
  { id: 'GRE', name: 'Super League' },
  { id: 'TUR', name: 'Süper Lig' },
  { id: 'ISR', name: 'Ligat ha\'Al' },
  { id: 'RSA', name: 'Premier Soccer League' },
  { id: 'EGY', name: 'Egyptian Premier League' },
  { id: 'MEX', name: 'Liga MX' },
  { id: 'ARG', name: 'Liga Profesional' },
  { id: 'BRA', name: 'Brasileirão' },
  { id: 'CHL', name: 'Primera División' },
  { id: 'COL', name: 'Categoría Primera A' },
  { id: 'PER', name: 'Liga 1' },
  { id: 'URU', name: 'Primera División' },
  { id: 'VEN', name: 'Primera División' },
  { id: 'ECU', name: 'Serie A' },
  { id: 'PAR', name: 'Primera División' },
  { id: 'BOL', name: 'División Profesional' },
];

export default function Home() {
  const [matches, setMatches] = useState<MatchWithPrediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLeague, setSelectedLeague] = useState<string>('');
  const [selectedDay, setSelectedDay] = useState<string>('today');

  // Get day names for the next 3 days
  const getDayOptions = () => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = new Date();
    const options = [
      { id: 'all', name: 'All' },
      { id: 'today', name: 'Today' }
    ];

    for (let i = 1; i <= 3; i++) {
      const nextDay = new Date(today);
      nextDay.setDate(today.getDate() + i);
      options.push({
        id: `day${i}`,
        name: days[nextDay.getDay()]
      });
    }

    return options;
  };

  const dayOptions = getDayOptions();

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getUpcomingMatches();
        console.log('Matches data in component:', data);
        
        // Get predictions for each match
        const matchesWithPredictions = await Promise.all(
          data.map(async (match) => {
            const prediction = await getMatchPrediction(match);
            return { ...match, prediction };
          })
        );
        
        setMatches(matchesWithPredictions);
      } catch (err) {
        console.error('Error in component:', err);
        setError('Failed to load matches. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  const filteredMatches = matches.filter(match => {
    const matchesSearch = searchTerm === '' || 
      match.homeTeam.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      match.awayTeam.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      match.competition.name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesLeague = selectedLeague === '' || 
      match.competition.id.toString() === selectedLeague;

    // Filter matches based on selected day
    const matchDate = new Date(match.utcDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let isSelectedDay = false;
    if (selectedDay === 'all') {
      const endOfWeek = new Date(today);
      endOfWeek.setDate(today.getDate() + 7);
      isSelectedDay = matchDate >= today && matchDate < endOfWeek;
    } else if (selectedDay === 'today') {
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      isSelectedDay = matchDate >= today && matchDate < tomorrow;
    } else {
      const dayIndex = parseInt(selectedDay.replace('day', ''));
      const startDate = new Date(today);
      startDate.setDate(today.getDate() + dayIndex);
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 1);
      isSelectedDay = matchDate >= startDate && matchDate < endDate;
    }

    return matchesSearch && matchesLeague && isSelectedDay;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">Loading matches and predictions...</h2>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-red-600">{error}</h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Football Matches</h1>
          <p className="mt-2 text-sm text-gray-600">Upcoming matches with AI predictions</p>
        </div>

        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <input
                type="text"
                placeholder="Search matches..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <CustomSelect
                options={[
                  { id: '', name: 'All Leagues', icon: '🌍' },
                  ...LEAGUES
                ]}
                value={selectedLeague}
                onChange={setSelectedLeague}
                placeholder="All Leagues"
                showFlags={true}
              />
            </div>
            <div>
              <CustomSelect
                options={dayOptions}
                value={selectedDay}
                onChange={setSelectedDay}
                placeholder="Select Day"
                showFlags={false}
              />
            </div>
          </div>
        </div>
        
        {filteredMatches.length === 0 ? (
          <div className="text-center">
            <p className="text-xl text-gray-600">No matches found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredMatches.map((match) => (
              <Link 
                href={`/matches/${match.id}`} 
                key={match.id}
                className="block"
              >
                <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <Image
                          src={match.competition.emblem}
                          alt={match.competition.name}
                          width={24}
                          height={24}
                          className="rounded"
                        />
                        <span className="text-sm font-medium text-gray-600">
                          {match.competition.name}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(match.utcDate).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <Image
                          src={match.homeTeam.crest}
                          alt={match.homeTeam.name}
                          width={32}
                          height={32}
                          className="rounded"
                        />
                        <span className="font-medium">{match.homeTeam.shortName}</span>
                      </div>
                      
                      <div className="text-gray-500">vs</div>
                      
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{match.awayTeam.shortName}</span>
                        <Image
                          src={match.awayTeam.crest}
                          alt={match.awayTeam.name}
                          width={32}
                          height={32}
                          className="rounded"
                        />
                      </div>
                    </div>

                    {match.prediction && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <h3 className="text-lg font-semibold mb-3">AI Predictions</h3>
                        
                        {/* Match Winner */}
                        <div className="grid grid-cols-3 gap-2 mb-3">
                          <div className="text-center">
                            <div className="text-sm font-medium text-gray-600">Home Win</div>
                            <div className="text-lg font-bold text-blue-600">{match.prediction?.matchWinner.home}%</div>
                          </div>
                          <div className="text-center">
                            <div className="text-sm font-medium text-gray-600">Draw</div>
                            <div className="text-lg font-bold text-gray-600">{match.prediction?.matchWinner.draw}%</div>
                          </div>
                          <div className="text-center">
                            <div className="text-sm font-medium text-gray-600">Away Win</div>
                            <div className="text-lg font-bold text-red-600">{match.prediction?.matchWinner.away}%</div>
                          </div>
                        </div>

                        {/* BTTS and Over/Under */}
                        <div className="grid grid-cols-2 gap-2 mb-3">
                          <div className="text-center">
                            <div className="text-sm font-medium text-gray-600">BTTS</div>
                            <div className="text-sm font-bold text-green-600">
                              {match.prediction?.btts.yes}% Yes
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-sm font-medium text-gray-600">Over 2.5</div>
                            <div className="text-sm font-bold text-green-600">
                              {match.prediction?.overUnder.over}%
                            </div>
                          </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Correct Score:</span>
                            <span className="font-medium">{match.prediction?.correctScore.mostLikely}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">HT/FT:</span>
                            <span className="font-medium">{match.prediction?.halfTimeFullTime.mostLikely}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">First to Score:</span>
                            <span className="font-medium">
                              {match.prediction?.firstTeamToScore.home > match.prediction?.firstTeamToScore.away ? 'Home' : 'Away'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Total Goals:</span>
                            <span className="font-medium">{match.prediction?.totalGoals.range}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Corners:</span>
                            <span className="font-medium">{match.prediction?.cornerCount.range}</span>
                          </div>
                        </div>

                        <div className="mt-3 text-xs text-gray-500">
                          Confidence: {match.prediction?.confidence}%
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 