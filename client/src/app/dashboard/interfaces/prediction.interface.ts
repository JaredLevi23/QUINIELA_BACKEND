export interface Prediction {
  matchId: string;
  result: 'HOME_WIN' | 'DRAW' | 'AWAY_WIN';
  _id: string;
  registerDate: string;
  updateDate: string;
}