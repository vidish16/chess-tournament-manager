#!/usr/bin/env python3
"""
Smart Chess Pairing Software
A simple script that generates optimal chess tournament pairings using intelligent algorithms.
Completely free - no API keys required!
"""

import os
import json
import logging
import random
from typing import List, Dict, Tuple, Optional
from dataclasses import dataclass
from datetime import datetime


@dataclass
class Player:
    """Represents a chess player in the tournament."""
    id: int
    name: str
    rating: int
    color_preference: str = "none"  # "white", "black", "none"
    previous_opponents: List[int] = None
    colors_played: List[str] = None  # Track color history
    score: float = 0.0  # Tournament score
    
    def __post_init__(self):
        if self.previous_opponents is None:
            self.previous_opponents = []
        if self.colors_played is None:
            self.colors_played = []
    
    def get_color_balance(self) -> int:
        """Return color balance: positive = more whites, negative = more blacks, 0 = balanced"""
        if not self.colors_played:
            return 0
        whites = self.colors_played.count("white")
        blacks = self.colors_played.count("black")
        return whites - blacks


@dataclass
class Pairing:
    """Represents a chess pairing between two players."""
    white_player: Player
    black_player: Player
    board_number: int
    
    def __str__(self):
        return f"Board {self.board_number}: {self.white_player.name} (White) vs {self.black_player.name} (Black)"


class ChessPairingAI:
    """Main class for intelligent chess pairing system - completely free!"""
    
    def __init__(self):
        self.setup_logging()
        self.logger.info("Smart Chess Pairing System initialized (no API keys needed!)")
    
    def setup_logging(self):
        """Set up logging configuration."""
        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s - %(levelname)s - %(message)s',
            handlers=[
                logging.FileHandler('chess_pairing.log'),
                logging.StreamHandler()
            ]
        )
        self.logger = logging.getLogger(__name__)
    
    def load_players_from_file(self, filename: str) -> List[Player]:
        """Load players from a JSON file."""
        try:
            with open(filename, 'r') as file:
                players_data = json.load(file)
            
            players = []
            for player_data in players_data:
                player = Player(
                    id=player_data['id'],
                    name=player_data['name'],
                    rating=player_data['rating'],
                    color_preference=player_data.get('color_preference', 'none'),
                    previous_opponents=player_data.get('previous_opponents', []),
                    colors_played=player_data.get('colors_played', []),
                    score=player_data.get('score', 0.0)
                )
                players.append(player)
            
            self.logger.info(f"Loaded {len(players)} players from {filename}")
            return players
        
        except FileNotFoundError:
            self.logger.error(f"Players file {filename} not found")
            return []
        except json.JSONDecodeError as e:
            self.logger.error(f"Invalid JSON in {filename}: {e}")
            return []
    
    def create_sample_players(self, count: int = 8) -> List[Player]:
        """Create sample players for testing."""
        players = []
        for i in range(1, count + 1):
            player = Player(
                id=i,
                name=f"Player {i}",
                rating=1200 + (i * 100),  # Ratings from 1300 to 2000
                color_preference="none"
            )
            players.append(player)
        
        self.logger.info(f"Created {count} sample players")
        return players
    
    def calculate_pairing_score(self, player1: Player, player2: Player) -> float:
        """Calculate how good a pairing is (lower score = better pairing)."""
        score = 0.0
        
        # Avoid repeat pairings (very high penalty)
        if player2.id in player1.previous_opponents:
            score += 1000
        
        # Rating difference penalty (prefer similar ratings)
        rating_diff = abs(player1.rating - player2.rating)
        score += rating_diff / 10  # Normalize rating difference
        
        # Color balance consideration
        p1_balance = player1.get_color_balance()
        p2_balance = player2.get_color_balance()
        
        # If both players have same color preference, small penalty
        if p1_balance > 0 and p2_balance > 0:  # Both prefer white
            score += 5
        elif p1_balance < 0 and p2_balance < 0:  # Both prefer black
            score += 5
        
        # Reward pairing players with opposite color needs
        if (p1_balance > 0 and p2_balance < 0) or (p1_balance < 0 and p2_balance > 0):
            score -= 10  # Bonus for good color balance
        
        return score
    
    def generate_smart_pairings(self, players: List[Player], round_number: int) -> List[Dict]:
        """Generate intelligent pairings using Swiss tournament principles."""
        self.logger.info(f"Generating smart pairings for round {round_number}")
        
        available_players = players.copy()
        pairings = []
        board_num = 1
        
        # Handle odd number of players
        bye_player = None
        if len(available_players) % 2 != 0:
            # Give bye to lowest-rated player who hasn't had one yet
            # For simplicity, we'll just take the lowest rated
            bye_player = min(available_players, key=lambda p: p.rating)
            available_players.remove(bye_player)
            self.logger.info(f"{bye_player.name} receives a bye this round")
        
        # Sort players by score (primary) and rating (secondary)
        available_players.sort(key=lambda p: (-p.score, -p.rating))
        
        # Pairing algorithm
        while len(available_players) >= 2:
            best_pairing = None
            best_score = float('inf')
            
            # Take the first player
            player1 = available_players[0]
            
            # Find the best opponent for player1
            for i in range(1, min(len(available_players), 6)):  # Check top 5 candidates
                player2 = available_players[i]
                pairing_score = self.calculate_pairing_score(player1, player2)
                
                if pairing_score < best_score:
                    best_score = pairing_score
                    best_pairing = (player1, player2, i)
            
            if best_pairing:
                p1, p2, p2_index = best_pairing
                
                # Determine colors based on balance and preferences
                if p1.get_color_balance() > p2.get_color_balance():
                    # p1 has played more whites, so give black
                    white_player, black_player = p2, p1
                elif p1.get_color_balance() < p2.get_color_balance():
                    # p1 has played more blacks, so give white
                    white_player, black_player = p1, p2
                else:
                    # Equal balance, use other factors
                    if round_number % 2 == 1:
                        white_player, black_player = p1, p2
                    else:
                        white_player, black_player = p2, p1
                
                pairings.append({
                    "white_player_id": white_player.id,
                    "black_player_id": black_player.id,
                    "board_number": board_num
                })
                
                # Remove paired players
                available_players.remove(p1)
                available_players.remove(p2)
                board_num += 1
            else:
                # Fallback: just pair first two players
                p1, p2 = available_players[0], available_players[1]
                pairings.append({
                    "white_player_id": p1.id,
                    "black_player_id": p2.id,
                    "board_number": board_num
                })
                available_players.remove(p1)
                available_players.remove(p2)
                board_num += 1
        
        self.logger.info(f"Generated {len(pairings)} pairings for round {round_number}")
        return pairings
    
    def get_ai_pairings(self, players: List[Player], round_number: int) -> List[Dict]:
        """Generate pairings using smart local algorithm."""
        return self.generate_smart_pairings(players, round_number)
    
    def update_player_data(self, players: List[Player], pairings: List[Dict]):
        """Update player data after pairings are made."""
        player_dict = {p.id: p for p in players}
        
        for pairing_data in pairings:
            white_id = pairing_data['white_player_id']
            black_id = pairing_data['black_player_id']
            
            white_player = player_dict.get(white_id)
            black_player = player_dict.get(black_id)
            
            if white_player and black_player:
                # Update previous opponents
                white_player.previous_opponents.append(black_id)
                black_player.previous_opponents.append(white_id)
                
                # Update color history
                white_player.colors_played.append("white")
                black_player.colors_played.append("black")
    
    def print_color_statistics(self, players: List[Player]):
        """Print color balance statistics for all players."""
        print("\nColor Balance Statistics:")
        print("-" * 40)
        for player in sorted(players, key=lambda p: p.name):
            balance = player.get_color_balance()
            whites = player.colors_played.count("white")
            blacks = player.colors_played.count("black")
            balance_str = f"+{balance}" if balance > 0 else str(balance)
            print(f"{player.name}: W:{whites} B:{blacks} (Balance: {balance_str})")
        print("-" * 40)
    def generate_fallback_pairings(self, players: List[Player]) -> List[Dict]:
        """Simple fallback pairing algorithm."""
        self.logger.info("Using simple pairing algorithm")
        
        if len(players) % 2 != 0:
            bye_player = min(players, key=lambda p: p.rating)
            players = [p for p in players if p.id != bye_player.id]
            self.logger.info(f"{bye_player.name} receives a bye this round")
        
        # Sort players by rating (highest first)
        sorted_players = sorted(players, key=lambda p: p.rating, reverse=True)
        
        pairings = []
        board_num = 1
        
        for i in range(0, len(sorted_players), 2):
            if i + 1 < len(sorted_players):
                # Simple color assignment
                if board_num % 2 == 1:
                    white_id = sorted_players[i].id
                    black_id = sorted_players[i + 1].id
                else:
                    white_id = sorted_players[i + 1].id
                    black_id = sorted_players[i].id
                
                pairings.append({
                    "white_player_id": white_id,
                    "black_player_id": black_id,
                    "board_number": board_num
                })
                board_num += 1
        
        return pairings
    
    def create_pairings_from_data(self, players: List[Player], pairing_data: List[Dict]) -> List[Pairing]:
        """Convert pairing data to Pairing objects."""
        player_dict = {p.id: p for p in players}
        pairings = []
        
        for data in pairing_data:
            white_player = player_dict.get(data['white_player_id'])
            black_player = player_dict.get(data['black_player_id'])
            
            if white_player and black_player:
                pairing = Pairing(
                    white_player=white_player,
                    black_player=black_player,
                    board_number=data['board_number']
                )
                pairings.append(pairing)
        
        return pairings
    
    def save_pairings(self, pairings: List[Pairing], round_number: int, filename: str = None):
        """Save pairings to a file."""
        if filename is None:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"round_{round_number}_pairings_{timestamp}.json"
        
        pairing_data = []
        for pairing in pairings:
            pairing_data.append({
                "board_number": pairing.board_number,
                "white_player": {
                    "id": pairing.white_player.id,
                    "name": pairing.white_player.name,
                    "rating": pairing.white_player.rating
                },
                "black_player": {
                    "id": pairing.black_player.id,
                    "name": pairing.black_player.name,
                    "rating": pairing.black_player.rating
                }
            })
        
        with open(filename, 'w') as file:
            json.dump({
                "round": round_number,
                "timestamp": datetime.now().isoformat(),
                "pairings": pairing_data
            }, file, indent=2)
        
        self.logger.info(f"Pairings saved to {filename}")
    
    def generate_round_pairings(self, players: List[Player], round_number: int) -> List[Pairing]:
        """Generate pairings for a tournament round."""
        self.logger.info(f"Generating pairings for round {round_number}")
        
        # Get smart pairings
        pairing_data = self.get_ai_pairings(players, round_number)
        
        # Update player data with new pairings
        self.update_player_data(players, pairing_data)
        
        # Convert to Pairing objects
        pairings = self.create_pairings_from_data(players, pairing_data)
        
        # Save pairings
        self.save_pairings(pairings, round_number)
        
        return pairings
    
    def print_pairings(self, pairings: List[Pairing], players: List[Player] = None):
        """Print pairings in a readable format."""
        print("\n" + "="*60)
        print("TOURNAMENT PAIRINGS")
        print("="*60)
        
        for pairing in pairings:
            white_balance = pairing.white_player.get_color_balance()
            black_balance = pairing.black_player.get_color_balance()
            print(f"Board {pairing.board_number}: {pairing.white_player.name} (White, Bal:{white_balance:+d}) vs {pairing.black_player.name} (Black, Bal:{black_balance:+d})")
            print(f"    Ratings: {pairing.white_player.rating} vs {pairing.black_player.rating}")
        
        print("="*60)
        
        if players:
            self.print_color_statistics(players)
        print()


def main():
    """Main function to run the chess pairing system."""
    try:
        # Initialize the AI pairing system
        pairing_system = ChessPairingAI()
        
        # Check if players file exists, otherwise create sample players
        players_file = "players.json"
        if os.path.exists(players_file):
            players = pairing_system.load_players_from_file(players_file)
        else:
            print(f"No {players_file} found. Creating sample players...")
            players = pairing_system.create_sample_players(8)
            
            # Save sample players for future use
            players_data = []
            for player in players:
                players_data.append({
                    "id": player.id,
                    "name": player.name,
                    "rating": player.rating,
                    "color_preference": player.color_preference,
                    "previous_opponents": player.previous_opponents,
                    "colors_played": player.colors_played,
                    "score": player.score
                })
            
            with open(players_file, 'w') as file:
                json.dump(players_data, file, indent=2)
            print(f"Sample players saved to {players_file}")
        
        if not players:
            print("No players available. Please add players to players.json")
            return
        
        # Generate pairings for round 1
        round_number = 1
        pairings = pairing_system.generate_round_pairings(players, round_number)
        
        # Display pairings
        pairing_system.print_pairings(pairings, players)
        
        print("Smart chess pairing generation completed successfully!")
        print("✅ No API keys required - completely FREE!")
        print("💡 The algorithm uses Swiss tournament principles:")
        print("   - Avoids repeat pairings")
        print("   - Balances colors across rounds") 
        print("   - Pairs similar-rated players when possible")
        
    except Exception as e:
        print(f"Error: {e}")
        logging.error(f"Application error: {e}", exc_info=True)


if __name__ == "__main__":
    main()
