export type User = {
  uid: string;
  name: string;
  games: string[];
};

export type Player = {
  userUid: string;
  name: string;
  score: number;
};

export type Image = {
  userUid: string;
  src: string;
};

export type Rating = {
  userUid: string;
  ratedUserUid: string;
  rating: number;
};

export type Round = {
  roundNumber: number;
  leader: string;
  theme: string;
  images: Image[];
  ratings: Rating[];
  total: Score[];
};

export type Score = {
  name: string;
  score: number;
};

export type Game = {
  uid: string;
  host: string;
  roomCode: string;
  createdAt: string;
  startedAt?: string;
  finishedAt?: string;
  players: Player[];
  rounds: Round[];
  total: Score[];
};
