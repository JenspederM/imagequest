export type User = {
  uid: string;
  name: string;
  theme: string;
  games: string[];
};

export type Player = {
  userUid: string;
  name: string;
  score: number;
};

export type Topic = {
  uid: string;
  userUid: string;
  topic: string;
};

export type Image = {
  uid: string;
  topicUid: string;
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
  topic: Topic;
  images: Image[];
  ratings: Rating[];
  total: Score[];
};

export type Score = {
  name: string;
  score: number;
};

export type Poke = {
  uid: string;
  userUid: string;
  pokedUserUid: string;
  isPoked: boolean;
};

export type Game = {
  uid: string;
  host: string;
  roomCode: string;
  createdAt: string;
  currentRound?: string;
  startedAt?: string;
  finishedAt?: string;
  pokes: Poke[];
  players: Player[];
  rounds: Round[];
  total: Score[];
};

export type GenerateGifRequest = {
  q: string;
  limit: number;
};

export type GenerateGifResponse = {
  urls: string[];
};
