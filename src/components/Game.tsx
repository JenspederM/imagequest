import { useEffect, useState } from "react";
import { SelectRoundTheme } from "./SelectRoundTheme";
import { DrawImage } from "./DrawImage";
import { RateImage } from "./RateImage";
import type { Game, User } from "../types";
import { ScoreBoard } from "./ScoreBoard";
import { newGame, newRound } from "../utils";

export function Game() {
  const user: User = { uid: "asdf", name: "asdf", games: [] };
  const [game, setGame] = useState(null as Game | null);
  const [leader, setLeader] = useState("");

  // Construct session
  //
  useEffect(() => {
    const game: Game = newGame(user, "abcd");
    game.rounds.push(newRound(1, "asdf", ""));
    setLeader("asdf");
    setGame(game);
  }, []);

  // Handle game state changes
  //
  useEffect(() => {
    if (!game || game.players.length === 0) {
      return;
    }

    const cur_round = game.rounds[game.rounds.length - 1];
    const all_rated = game.players.every((player) =>
      cur_round.ratings.find((rating) => rating.userUid === player.userUid)
    );

    if (all_rated && cur_round.total.length === 0) {
      const newSubTotal = game.rounds[game.rounds.length - 1].ratings.reduce(
        (acc, rating) => {
          if (acc[rating.ratedUserUid]) {
            acc[rating.ratedUserUid] += rating.rating;
          } else {
            acc[rating.ratedUserUid] = rating.rating;
          }
          return acc;
        },
        {} as { [key: string]: number }
      );

      setGame({
        ...game,
        rounds: game.rounds.map((round, i) => {
          if (i === game.rounds.length - 1) {
            round.total = Object.entries(newSubTotal).map(([name, score]) => ({
              name,
              score,
            }));
          }
          return round;
        }),
      });
    }

    console.log("game changed", game);
  }, [game]);

  function startGame() {
    if (!game) {
      return;
    }

    setGame({
      ...game,
      startedAt: new Date().toISOString(),
    });
  }

  function nextRound() {
    if (!game) {
      return;
    }
    setGame({
      ...game,
      rounds: [...game.rounds, newRound(game.rounds.length + 1, leader, "")],
    });
  }

  function finishGame() {
    if (!game) {
      return;
    }

    const rounds = [
      ...game.rounds,
      {
        roundNumber: game.rounds.length + 1,
        images: [],
        ratings: [],
        total: [],
      },
    ];

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

    setGame({
      ...game,
      finishedAt: new Date().toISOString(),
      total: Object.entries(total).map(([name, score]) => ({ name, score })),
    });
  }

  if (!game) {
    return <h1>Loading...</h1>;
  }

  if (!game.startedAt) {
    return (
      <button className="btn btn-primary btn-block" onClick={startGame}>
        Start Game
      </button>
    );
  }

  if (!game.rounds[game.rounds.length - 1].theme) {
    return (
      <SelectRoundTheme
        leader={leader}
        isLeader={leader === user.uid}
        setRoundTheme={(theme: string) => {
          if (!game) {
            return;
          }
          setGame({
            ...game,
            rounds: game.rounds.map((round, i) => {
              if (i === game.rounds.length - 1) {
                round.theme = theme;
              }
              return round;
            }),
          });
        }}
      ></SelectRoundTheme>
    );
  }

  if (
    !game.rounds[game.rounds.length - 1].images.find(
      (image) => image.userUid === user.uid
    )
  ) {
    return (
      <DrawImage
        theme={game.rounds[game.rounds.length - 1].theme}
        onSave={(image: string) => {
          setGame({
            ...game,
            rounds: game.rounds.map((round, i) => {
              if (i === game.rounds.length - 1) {
                round.images.push({ userUid: user.uid, src: image });
              }
              return round;
            }),
          });
        }}
      ></DrawImage>
    );
  }

  if (
    !game.players.every((player) =>
      game.rounds[game.rounds.length - 1].images.find(
        (image) => image.userUid === player.userUid
      )
    )
  ) {
    <h1 className="text-2xl font-bold text-center">
      Waiting for all players to submit their drawings
    </h1>;
  }

  if (
    !game.rounds[game.rounds.length - 1].ratings.find(
      (rating) => rating.userUid === user.uid
    )
  ) {
    return (
      <RateImage
        src={game.rounds[game.rounds.length - 1].images[0].src}
        theme={game.rounds[game.rounds.length - 1].theme}
        onRate={(rating: number) => {
          const newRating = {
            ratedUserUid: game.rounds[game.rounds.length - 1].images[0].userUid,
            userUid: user.uid,
            rating: rating,
          };
          setGame({
            ...game,
            rounds: game.rounds.map((round, i) => {
              if (i === game.rounds.length - 1) {
                round.ratings.push(newRating);
              }
              return round;
            }),
          });
        }}
      ></RateImage>
    );
  }

  if (
    !game.players.every((player) =>
      game.rounds[game.rounds.length - 1].ratings.find(
        (rating) => rating.userUid === player.userUid
      )
    )
  ) {
    return (
      <h1 className="text-2xl font-bold text-center">
        Waiting for all players to rate the images
      </h1>
    );
  }

  if (!game.finishedAt) {
    return (
      <ScoreBoard
        total={game.rounds[game.rounds.length - 1].total}
        nextRound={nextRound}
        finishGame={finishGame}
      ></ScoreBoard>
    );
  }

  return <ScoreBoard total={game.total}></ScoreBoard>;
}
