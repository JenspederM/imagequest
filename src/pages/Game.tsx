import { useEffect, useState } from "react";
import { SelectRoundTopic } from "../components/SelectRoundTopic";
import { DrawImage } from "../components/DrawImage";
import { RateImage } from "../components/RateImage";
import { Rating, Round, Topic, type Game } from "../types";
import { ScoreBoard } from "../components/ScoreBoard";
import { newImage, newRound, getIconedName } from "../utils";
import {
  arrayUnion,
  collection,
  deleteDoc,
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
import { WaitingForPlayers } from "../components/WaitingForPlayers";
import { LoadingWithTimeout } from "../components/LoadingWithTimeout";

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
      console.debug("game changed", doc.data());
      const game = doc.data() as Game;
      setGame(game);
    });

    fetchGame();
    return unsub;
  }, []);

  useEffect(() => {
    if (!game || !game.pokes) return;

    game.pokes.forEach(async (poke) => {
      if (poke.pokedUserUid === user.uid && !poke.isPoked) {
        const player = game.players.find(
          (player) => player.userUid === poke.userUid
        );
        addNotification(`${player?.name} poked you`, "info");
        const newPokes = game.pokes.map((p) => {
          if (p.uid === poke.uid) {
            return { ...p, isPoked: true };
          }
          return p;
        });
        await updateDoc(doc(db, "games", gameId), {
          pokes: newPokes,
        });
      }
    });

    console.log("game.pokes", game.pokes);
  }, [game?.pokes]);

  useEffect(() => {
    if (!game || !game.currentRound) {
      return;
    }

    const roundRef = doc(db, "games", gameId, "rounds", game.currentRound);

    async function fetchRound() {
      const roundDoc = await getDoc(roundRef);
      const round = roundDoc.data() as Round;
      console.debug("round", round);
      setCurrentRound(round);
    }

    const unsub = onSnapshot(roundRef, (doc) => {
      if (!doc.exists()) {
        return;
      }
      console.debug("round changed", doc.data());
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
    const lead = game.players[Math.floor(Math.random() * game.players.length)];
    const round = newRound(game.rounds.length + 1, lead.name, "");
    await updateDoc(doc(db, "games", gameId), {
      startedAt: new Date().toISOString(),
      currentRound: round.uid,
      rounds: arrayUnion(round.uid),
    });
    await setDoc(doc(db, "games", gameId, "rounds", round.uid), round);
  }

  async function cancelGame() {
    if (!game) {
      return;
    }
    if (game.players.length === 1) {
      await deleteDoc(doc(db, "games", gameId));
      navigate("/");
      return;
    }

    const newPlayers = game.players.filter(
      (player) => player.userUid !== user.uid
    );
    const newHost = newPlayers[0].userUid;
    await updateDoc(doc(db, "games", gameId), {
      host: newHost,
      players: newPlayers,
    });

    navigate("/");
  }

  function nextRound() {
    if (!game || !currentRound) {
      return;
    }
    const leadIndex = Math.floor(Math.random() * game.players.length);
    const nextLead = game.players[leadIndex].name;
    if (nextLead === currentRound.leader) {
      return nextRound();
    }
    const round = newRound(game.rounds.length + 1, nextLead, "");
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

  if (!game) {
    return <LoadingWithTimeout></LoadingWithTimeout>;
  }

  if (!game.startedAt) {
    return (
      <>
        <div className="bg-neutral text-neutral-content rounded-xl mb-6">
          <div className="flex flex-col space-y-1 py-4 px-8 text-center">
            <div className="text-sm">Room Code</div>
            <div className="text-primary text-2xl font-bold">
              {game.roomCode}
            </div>
          </div>
        </div>
        <div className="flex flex-col flex-grow items-center space-y-2">
          {game.players.map((player, i) => (
            <div className="grid font-bold text-xl" key={player.userUid}>
              {getIconedName(game, player, i)}
            </div>
          ))}
        </div>
        <div className="flex flex-col space-y-2">
          <button
            className="btn btn-primary btn-block"
            disabled={
              // !import.meta.env.DEV &&
              user.uid !== game.host || game.players.length < 2
            }
            onClick={() => startGame()}
          >
            Start Game
          </button>
          <button
            className="btn btn-error btn-block"
            onClick={() => cancelGame()}
          >
            {game.players.length < 2 ? "Cancel Game" : "Leave Game"}
          </button>
        </div>
      </>
    );
  }

  if (currentRound && !currentRound.topic) {
    return (
      <SelectRoundTopic
        leader={currentRound.leader}
        isLeader={currentRound.leader === user.name}
        setRoundTopic={(topic: Topic) => {
          if (!game) {
            return;
          }
          updateDoc(doc(db, "games", gameId, "rounds", currentRound.uid), {
            topic,
          });
        }}
      ></SelectRoundTopic>
    );
  }

  if (
    currentRound &&
    !currentRound.images.find((image) => image.userUid === user.uid)
  ) {
    return (
      <DrawImage
        topic={currentRound.topic}
        onSave={(image: string) => {
          updateDoc(doc(db, "games", gameId, "rounds", currentRound.uid), {
            images: arrayUnion(newImage(image, user.uid, currentRound.topic)),
          });
        }}
      ></DrawImage>
    );
  }

  if (
    currentRound &&
    !game.players.every((player) =>
      //     topics.every((topic) =>
      //       currentRound.images.find(
      //         (image) =>
      //           topic.uid === image.topicUid && image.userUid === player.userUid
      //       )
      //     )
      currentRound.images.find((image) => image.userUid === player.userUid)
    )
  ) {
    return (
      <WaitingForPlayers
        user={user}
        game={game}
        isReady={(player) => {
          return currentRound.images.some(
            (rating) => rating.userUid === player.userUid
          );
        }}
      ></WaitingForPlayers>
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
        topic={currentRound.topic}
        onRate={(ratings: Rating[]) => {
          console.debug("ratings", ratings);
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
      <WaitingForPlayers
        user={user}
        game={game}
        isReady={(player) => {
          return currentRound.ratings.some(
            (rating) => rating.userUid === player.userUid
          );
        }}
      ></WaitingForPlayers>
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

  if (game.finishedAt) {
    return (
      <ScoreBoard
        isHost={game.host === user.uid}
        total={game.total}
      ></ScoreBoard>
    );
  }

  return <LoadingWithTimeout></LoadingWithTimeout>;
}
