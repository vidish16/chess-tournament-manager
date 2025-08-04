# Chess Pairing AI

**AI-based Chess Pairing Software tailored for local chess community**

A modern, web-based chess tournament management system featuring intelligent Swiss pairing algorithm, interactive data visualizations, player analytics, and cost-effective API usage.

## 🚀 Features

- **Swiss Tournament Pairing System**: Advanced algorithm with ELO optimization and color balancing
- **Interactive Dashboard**: Real-time tournament management with modern UI
- **Player Analytics**: Comprehensive performance tracking with charts and statistics
- **Data Visualization**: Interactive force-directed graphs showing player connections and match results
- **Mobile Responsive**: Clean, professional interface optimized for all devices
- **API Integration**: RESTful APIs for tournament, player, and pairing management
- **Real-time Updates**: Live tournament status and rankings

## 🛠 Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **UI Components**: Radix UI, Framer Motion
- **Data Visualization**: D3.js, Recharts
- **State Management**: Zustand, React Query
- **Database**: SQLite with Prisma (planned)
- **AI Integration**: OpenAI API (planned)

## 📦 Installation

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

## 🎯 Usage

### Dashboard Overview
- View active tournaments and player rankings
- Monitor tournament progress and standings
- Access player analytics and performance metrics

### Tournament Management
- Create new tournaments with Swiss system
- Generate intelligent pairings for each round
- Track match results and update rankings

### Player Analytics
- Rating progression charts
- Performance vs opponent rating analysis
- Color distribution and time management stats
- Opening performance breakdown

### API Endpoints

#### Players
- `GET /api/players` - List all players with sorting and pagination
- `POST /api/players` - Create new player

#### Tournaments  
- `GET /api/tournaments` - List tournaments (filter by status)
- `POST /api/tournaments` - Create new tournament

#### Pairings
- `GET /api/pairings?tournamentId=1&round=2` - Get round pairings
- `POST /api/pairings` - Generate new round pairings

## 🚧 Roadmap

- [ ] Database integration with Prisma
- [ ] OpenAI API integration for advanced pairing optimization
- [ ] Real-time match tracking
- [ ] Tournament bracket visualization
- [ ] Email notifications for players
- [ ] Export tournament reports (PDF)
- [ ] Player authentication system
- [ ] Mobile app companion

## 📝 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

Contributions welcome! Please read our contributing guidelines before submitting PRs.

---

**Built for chess communities with ❤️**

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
