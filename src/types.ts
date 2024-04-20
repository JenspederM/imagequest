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
  uid: string;
  userUid: string;
  src: string;
};

export type Rating = {
  imageUid: string;
  userUid: string;
  ratedUserUid: string;
  rating: number;
};

export type Round = {
  uid: string;
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
  currentRound?: string;
  startedAt?: string;
  finishedAt?: string;
  players: Player[];
  rounds: Round[];
  total: Score[];
};

export type GenerateGifRequest = {
  data: {
    q: string;
    limit: number;
  };
};

export type GenerateGifResponse = {
  urls: string[];
};
