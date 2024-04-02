import { User } from "./types";

export function newRound(i: number, leader: string, theme: string) {
  return {
    roundNumber: i,
    leader: leader,
    theme: theme,
    images: [],
    ratings: [],
    total: [],
  };
}

export function newGame(host: User, roomCode: string) {
  return {
    uid: "abcd",
    host: host.uid,
    roomCode: roomCode,
    createdAt: new Date().toISOString(),
    players: [{ userUid: host.uid, name: host.name, score: 0 }],
    rounds: [],
    total: [],
  };
}
