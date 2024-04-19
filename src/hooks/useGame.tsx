import { useEffect, useState } from "react";
import { Game } from "../types";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "../firebaseConfig";

export default function useGame(gameId: string) {
  const [game, setGame] = useState<Game | null>(null);

  useEffect(() => {
    async function fetchGame() {
      const gameDoc = await getDoc(doc(db, "games", gameId));
      if (!gameDoc.exists()) {
        return;
      }
      const game = gameDoc.data() as Game;
      setGame(game);
    }

    const unsub = onSnapshot(doc(db, "games", gameId), (doc) => {
      console.log("game changed", doc.data());
      const game = doc.data() as Game;
      setGame(game);
    });

    fetchGame();
    return unsub;
  }, [gameId]);

  return game;
}
