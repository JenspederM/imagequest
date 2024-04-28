import { Image, User } from "./types";

export const changeTheme = (theme?: string, defaultTheme: string = "dark") => {
  const body = document.querySelector("html");
  if (!body) return;
  if (theme) {
    body.setAttribute("data-theme", theme);
  } else {
    body.setAttribute("data-theme", defaultTheme);
  }
};

export function newUser(uid: string) {
  return {
    uid: uid,
    name: "",
    theme: "dark",
    games: [],
  };
}

export function newImage(src: string, userUid: string) {
  return {
    uid: firebaseGuid(),
    src: src,
    userUid: userUid,
  };
}

export function newRating(image: Image, userUid: string, rating: number) {
  return {
    imageUid: image.uid,
    ratedUserUid: image.userUid,
    userUid: userUid,
    rating: rating,
  };
}

export function newRound(i: number, leader: string, theme: string) {
  return {
    uid: firebaseGuid(),
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
    uid: firebaseGuid(),
    host: host.uid,
    roomCode: roomCode,
    createdAt: new Date().toISOString(),
    players: [{ userUid: host.uid, name: host.name, score: 0 }],
    rounds: [],
    total: [],
  };
}

export const firebaseGuid = (length: number = 28) => {
  const CHARS =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  let autoId = "";

  for (let i = 0; i < length; i++) {
    autoId += CHARS.charAt(Math.floor(Math.random() * CHARS.length));
  }

  return autoId;
};

export const delay = (ms: number): Promise<number> =>
  new Promise((res) => {
    return setTimeout(res, ms);
  });

export const popRandom = (arr: any[]) => {
  const index = Math.floor(Math.random() * arr.length);
  return arr.splice(index, 1).pop();
};

export const makeString = (arr: string[]) => {
  if (arr.length === 1) return arr[0];
  const firsts = arr.slice(0, arr.length - 1);
  const last = arr[arr.length - 1];
  return firsts.join(", ") + " and " + last;
};
