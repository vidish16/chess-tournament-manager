# Chess Tournament Manager

**Professional Chess Tournament Management System for Local Chess Communities**

A modern, web-based chess tournament management system featuring Swiss pairing algorithm, comprehensive player management, and intuitive tournament administration tools.

## 🏆 Features

### Core Tournament Management
- **Swiss Pairing System**: Automated pairing algorithm with proper BYE handling
- **Player Registration**: Complete player management with ratings and profiles
- **Round Management**: Easy result entry with descriptive win/loss/draw displays
- **Automatic Progression**: Smart tournament flow from setup to completion
- **Final Leaderboards**: Professional tournament standings and results

### User Experience
- **Clean Interface**: Modern, responsive design optimized for tournament directors
- **Logo Integration**: Custom branding support for your chess organization
- **Table View**: Traditional round-wise results display familiar to chess players
- **Real-time Updates**: Live tournament status and automatic tab switching
- **Mobile Responsive**: Works seamlessly on desktop, tablet, and mobile devices

### Tournament Features
- **Random Color Assignment**: Fair white/black distribution across rounds
- **BYE Management**: Proper assignment to lowest-ranked players
- **Multiple Views**: Pairings, Results, and Table views for different needs
- **Tournament Completion**: Automatic detection and leaderboard display
- **Result Tracking**: Complete game history and player performance

## 🛠 Tech Stack

- **Framework**: Next.js 15.4.5 with App Router and Turbopack
- **Language**: TypeScript for type-safe development
- **Styling**: Tailwind CSS for modern, responsive design
- **UI Components**: Radix UI for accessible, professional components
- **Animations**: Framer Motion for smooth user interactions
- **Image Optimization**: Next.js Image component for logo and assets

## 📦 Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd chess-tournament-manager
```

2. **Install dependencies**
```bash
npm install
```

3. **Add your logo** (optional)
   - Place your logo file as `public/logo.png`
   - The system will automatically display it in the header

4. **Start the development server**
```bash
npm run dev
```

5. **Open your browser**
   - Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 How to Use

### 1. Player Registration
- Navigate to the "Players" tab
- Add players with their names and ratings
- Edit or remove players as needed
- Minimum 4 players required to start a tournament

### 2. Tournament Setup
- Go to "Setup" tab (enabled when you have 4+ players)
- Configure tournament name, number of rounds, and time control
- Click "Create Tournament" to begin

### 3. Tournament Management
- **Pairings Tab**: View current round matchups (BYE appears at top)
- **Results Tab**: Enter match results with simple Win/Loss/Draw buttons
- **Table View**: See traditional round-by-round results grid
- Tournament automatically advances rounds and shows final leaderboard

### 4. Tournament Completion
- System automatically detects when all rounds are complete
- Switches to final leaderboard view
- Displays complete tournament results and player standings

## 🎮 Tournament Flow

1. **Player Registration** → Register all participants
2. **Tournament Setup** → Configure rounds and time controls  
3. **Round 1** → Automatic pairings generated
4. **Result Entry** → Enter match outcomes
5. **Automatic Advancement** → System moves to next round
6. **Repeat** → Continue until all rounds complete
7. **Final Results** → Automatic leaderboard display

## 🏅 Swiss Pairing Algorithm

Our implementation follows standard Swiss tournament rules:
- Players sorted by score, then by rating
- BYE assigned to lowest-ranked player when odd number of participants
- Random color assignment for fair play
- Proper score tracking and ranking

## 📱 Interface Overview

- **Dashboard**: Player count, tournament status, current round display
- **Navigation**: Clean tab system for easy tournament management
- **Visual Feedback**: Color-coded results, clear status indicators
- **Professional Design**: Tournament director-friendly interface

## 🔧 Built-in Features

- ✅ Swiss pairing with BYE handling
- ✅ Player management system
- ✅ Random color assignment
- ✅ Multiple result views
- ✅ Automatic tournament progression
- ✅ Logo integration
- ✅ Responsive design
- ✅ Real-time updates
- ✅ Final leaderboards

## 📝 License

MIT License - Feel free to use for your chess community!

## 🤝 Contributing

Contributions welcome! This system is designed to help chess communities run better tournaments.

---

**Built for Chess Communities with ❤️**

Perfect for local chess clubs, schools, community centers, and tournament organizers who need a reliable, easy-to-use tournament management system.
