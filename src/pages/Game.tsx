import { useEffect, useState } from "react";
import { SelectRoundTheme } from "../components/SelectRoundTheme";
import { DrawImage } from "../components/DrawImage";
import { RateImage } from "../components/RateImage";
import { Player, Rating, Round, type Game } from "../types";
import { ScoreBoard } from "../components/ScoreBoard";
import { newImage, newRound } from "../utils";
import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useUser } from "../providers/AuthProvider";
import { useNavigate, useParams } from "react-router-dom";
import { useAddNotification } from "../providers/NotificationProvider";

const hostIcon = "👑";
const playerIcons = ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼"];

export function Game() {
  const navigate = useNavigate();
  const addNotification = useAddNotification();
  const user = useUser();
  const params = useParams();
  const [game, setGame] = useState<Game | null>(null);
  const [currentRound, setCurrentRound] = useState<Round | null>(null);
  const gameId = params.id as string;

  // Construct session
  //
  useEffect(() => {
    if (!user) {
      return;
    }

    const gameRef = doc(db, "games", gameId);

    async function fetchGame() {
      const gameDoc = await getDoc(gameRef);
      if (!gameDoc.exists()) {
        addNotification("Game not found", "error");
        navigate("/");
        return;
      }
      const game = gameDoc.data() as Game;
      setGame(game);
    }

    const unsub = onSnapshot(gameRef, (doc) => {
      console.log("game changed", doc.data());
      const game = doc.data() as Game;
      setGame(game);
    });

    fetchGame();
    return unsub;
  }, []);

  useEffect(() => {
    if (!game || !game.currentRound) {
      return;
    }

    const roundRef = doc(db, "games", gameId, "rounds", game.currentRound);

    async function fetchRound() {
      const roundDoc = await getDoc(roundRef);
      const round = roundDoc.data() as Round;
      console.log("round", round);
      setCurrentRound(round);
    }

    const unsub = onSnapshot(roundRef, (doc) => {
      if (!doc.exists()) {
        return;
      }
      console.log("round changed", doc.data());
      const round = doc.data() as Round;
      setCurrentRound(round);

      const allRated = game.players.every((player) =>
        round.ratings.find((rating) => rating.userUid === player.userUid)
      );

      if (allRated && round.total.length === 0) {
        const newSubTotal = round.ratings.reduce((acc, rating) => {
          const playerName = game.players.find(
            (player) => player.userUid === rating.ratedUserUid
          )?.name;
          if (!playerName) {
            return acc;
          }
          if (acc[playerName]) {
            acc[playerName] += rating.rating;
          } else {
            acc[playerName] = rating.rating;
          }
          return acc;
        }, {} as { [key: string]: number });

        updateDoc(roundRef, {
          total: Object.entries(newSubTotal).map(([name, score]) => ({
            name,
            score,
          })),
        });
      }
    });

    fetchRound();
    return unsub;
  }, [game?.currentRound]);

  async function startGame() {
    if (!game) {
      return;
    }
    const round = newRound(game.rounds.length + 1, user.name, "");
    await updateDoc(doc(db, "games", gameId), {
      startedAt: new Date().toISOString(),
      currentRound: round.uid,
      rounds: arrayUnion(round.uid),
    });
    await setDoc(doc(db, "games", gameId, "rounds", round.uid), round);
  }

  function nextRound() {
    if (!game || !currentRound) {
      return;
    }
    const leaderIdx = Math.floor(Math.random() * game.players.length);
    const nextLeader = game.players[leaderIdx].name;
    if (nextLeader === currentRound.leader) {
      return nextRound();
    }
    const round = newRound(game.rounds.length + 1, nextLeader, "");
    updateDoc(doc(db, "games", gameId), {
      currentRound: round.uid,
      rounds: arrayUnion(round.uid),
    });
    setDoc(doc(db, "games", gameId, "rounds", round.uid), round);
  }

  async function finishGame() {
    if (!game) {
      return;
    }

    const docs = await getDocs(collection(db, "games", gameId, "rounds"));

    if (docs.empty) {
      return;
    }

    const rounds = docs.docs.map((doc) => doc.data() as Round);

    const total = rounds.reduce((total, round) => {
      return round.total.reduce((acc, score) => {
        if (acc[score.name]) {
          acc[score.name] += score.score;
        } else {
          acc[score.name] = score.score;
        }
        return acc;
      }, total);
    }, {} as { [key: string]: number });

    updateDoc(doc(db, "games", gameId), {
      finishedAt: new Date().toISOString(),
      total: Object.entries(total).map(([name, score]) => ({ name, score })),
    });
  }

  function getPlayerName(player: Player, i: number = 0) {
    if (!game) {
      return "";
    }
    const icon =
      player.userUid === game.host
        ? hostIcon
        : playerIcons[i % playerIcons.length];

    return `${icon} ${player.name} ${icon}`;
  }

  if (!game) {
    return <h1>Loading...</h1>;
  }

  if (!game.startedAt) {
    return (
      <>
        <div className="bg-neutral text-neutral-content rounded-xl mb-6">
          <div className="flex flex-col space-y-1 py-4 px-8 text-center">
            <div className="text-sm">Room Code</div>
            <div className="text-2xl font-bold">{game.roomCode}</div>
          </div>
        </div>
        <div className="flex flex-col flex-grow items-center space-y-2">
          {game.players.map((player, i) => (
            <div className="grid font-bold text-xl" key={player.userUid}>
              {getPlayerName(player, i)}
            </div>
          ))}
        </div>
        <button
          className="btn btn-primary btn-block"
          disabled={user.uid !== game.host || game.players.length < 2}
          onClick={() => startGame()}
        >
          Start Game
        </button>
      </>
    );
  }

  if (currentRound && !currentRound.theme) {
    return (
      <SelectRoundTheme
        leader={currentRound.leader}
        isLeader={currentRound.leader === user.name}
        setRoundTheme={(theme: string) => {
          if (!game) {
            return;
          }
          updateDoc(doc(db, "games", gameId, "rounds", currentRound.uid), {
            theme,
          });
        }}
      ></SelectRoundTheme>
    );
  }

  if (
    currentRound &&
    !currentRound.images.find((image) => image.userUid === user.uid)
  ) {
    return (
      <DrawImage
        theme={currentRound.theme}
        onSave={(image: string) => {
          updateDoc(doc(db, "games", gameId, "rounds", currentRound.uid), {
            images: arrayUnion(newImage(image, user.uid)),
          });
        }}
      ></DrawImage>
    );
  }

  if (
    currentRound &&
    !game.players.every((player) =>
      currentRound.images.find((image) => image.userUid === player.userUid)
    )
  ) {
    return (
      <h1 className="text-2xl font-bold text-center">
        Waiting for all players to submit their drawings
      </h1>
    );
  }

  if (
    currentRound &&
    !currentRound.ratings.find((rating) => rating.userUid === user.uid)
  ) {
    return (
      <RateImage
        user={user}
        images={currentRound.images}
        theme={currentRound.theme}
        onRate={(ratings: Rating[]) => {
          console.log("ratings", ratings);
          updateDoc(doc(db, "games", gameId, "rounds", currentRound.uid), {
            ratings: arrayUnion(...ratings),
          });
        }}
      ></RateImage>
    );
  }

  if (
    currentRound &&
    !game.players.every((player) =>
      currentRound.ratings.find((rating) => rating.userUid === player.userUid)
    )
  ) {
    return (
      <h1 className="text-2xl font-bold text-center">
        Waiting for all players to rate the images
      </h1>
    );
  }

  if (currentRound && !game.finishedAt) {
    return (
      <ScoreBoard
        total={currentRound.total}
        isHost={game.host === user.uid}
        nextRound={nextRound}
        finishGame={finishGame}
      ></ScoreBoard>
    );
  }

  return (
    <ScoreBoard isHost={game.host === user.uid} total={game.total}></ScoreBoard>
  );
}
