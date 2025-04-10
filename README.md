# Football Predictions AI

A Next.js application that provides AI-powered football match predictions and betting tips for top football leagues.

## Features

- Real-time upcoming matches from top leagues (Premier League, La Liga, Serie A, Bundesliga, Ligue 1)
- AI-generated match predictions including:
  - Match winner
  - Both teams to score
  - Over/Under 2.5 goals
  - Correct score
  - Half-time/Full-time result
  - First team to score
  - Total goals estimate
  - Corner count range
- Detailed match analysis
- Betting tips and recommendations
- Responsive design

## Prerequisites

- Node.js 18.x or later
- npm or yarn
- Football Data API key (from [football-data.org](https://www.football-data.org/))
- OpenAI API key

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd football-predictions-ai
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file in the root directory and add your API keys:
```env
NEXT_PUBLIC_FOOTBALL_API_KEY=your_football_api_key_here
OPENAI_API_KEY=your_openai_api_key_here
NEXT_PUBLIC_FOOTBALL_API_URL=https://api.football-data.org/v4
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Technologies Used

- Next.js 13
- TypeScript
- Tailwind CSS
- OpenAI API
- Football Data API
- date-fns

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
