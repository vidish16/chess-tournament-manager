# Swiss Tournament Rounds Validation Test

## Validation Rules Implemented:

### For Swiss System:
- **Minimum rounds**: 1
- **Maximum rounds**: Math.min(Math.ceil(log2(playerCount)) + 3, 12)
- **Recommended rounds**:
  - Small tournaments (≤8 players): Math.max(3, Math.ceil(log2(n)))
  - Medium tournaments (8-16 players): Math.ceil(log2(n)) + 1
  - Large tournaments (16+ players): Math.ceil(log2(n)) + 2 (capped at 10)

### Examples by Player Count:

| Players | Min | Max | Recommended | Round-Robin Rounds | Notes |
|---------|-----|-----|-------------|-------------------|-------|
| 4       | 1   | 5   | 3           | 3                 | Small tournament |
| 5       | 1   | 6   | 3           | 5                 | Small tournament (odd) |
| 8       | 1   | 6   | 4           | 7                 | Small tournament |
| 9       | 1   | 7   | 4           | 9                 | Medium tournament (odd) |
| 12      | 1   | 7   | 5           | 11                | Medium tournament |
| 16      | 1   | 7   | 6           | 15                | Medium tournament |

### For Round-Robin System:
- **Fixed rounds**: playerCount - 1 + playerCount % 2
- **Explanation**: The formula n-1+n%2 ensures proper pairing in round-robin tournaments
  - For even number of players: n-1 rounds (each player plays all others exactly once)
  - For odd number of players: n rounds (to accommodate bye rounds)
- **Validation**: Disabled for >12 players (too many rounds)

## User Experience Features:

1. **Real-time validation**: Input is constrained to valid range
2. **Error messages**: Clear feedback when validation fails
3. **Helpful hints**: Shows recommended rounds and optimal ranges
4. **Format-specific behavior**: Input disabled for round-robin
5. **Visual feedback**: Red border and error text for invalid inputs

## Testing:

To test the validation:
1. Open the tournament creation interface
2. Add different numbers of players (4, 8, 16, 32)
3. Select Swiss format
4. Try entering rounds outside the valid range
5. Observe validation messages and input constraints
6. Switch to round-robin and verify input is disabled
