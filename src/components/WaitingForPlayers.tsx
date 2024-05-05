import { useEffect, useState } from "react";
import type { Player, Game, User } from "../types";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { newPoke } from "../utils";

export function WaitingForPlayers(props: {
  user: User;
  game: Game;
  isReady: (player: Player) => boolean;
}) {
  const [pokingEnabled, setPokingEnabled] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setPokingEnabled(true);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  async function poke(player: Player) {
    await updateDoc(doc(db, "games", props.game.uid), {
      pokes: arrayUnion(newPoke(props.user.uid, player.userUid)),
    });
    console.log("Poking", player);
  }

  return (
    <>
      <div className="text-2xl font-bold mb-6 text-primary">
        Waiting for other players
      </div>

      <div className="flex flex-col items-center text-center">
        <div className="flex flex-col space-y-2 w-4/5">
          {props.game.players.map((player) =>
            props.isReady(player) ? (
              <div
                key={player.name}
                className="flex items-center justify-center py-3 px-4 text-sm font-semibold space-x-1 bg-success text-success-content rounded-lg"
              >
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className="h-6 w-6 fill-current"
                  >
                    <path d="M9.9997 15.1709L19.1921 5.97852L20.6063 7.39273L9.9997 17.9993L3.63574 11.6354L5.04996 10.2212L9.9997 15.1709Z"></path>
                  </svg>
                </div>
                <div>{player.name}</div>
              </div>
            ) : (
              <button
                key={player.name}
                className="btn btn-block btn-error"
                disabled={!pokingEnabled}
                onClick={() => poke(player)}
              >
                {props.isReady(player) ? (
                  "✅"
                ) : pokingEnabled ? (
                  <div className="flex text-xl">👆</div>
                ) : (
                  <div className="loading loading-bars"></div>
                )}
                {player.name}{" "}
              </button>
            )
          )}
        </div>
      </div>
    </>
  );
}
