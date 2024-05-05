import { useEffect, useState } from "react";
import { Input } from "../components/Input";
import { newGame } from "../utils";
import {
  DocumentData,
  arrayUnion,
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";
import { useUser } from "../providers/AuthProvider";
import { useAddNotification } from "../providers/NotificationProvider";
import { generate as generateRandomWord } from "random-words";

const activeTabClass = "tab tab-active tab-bordered tab-lg";
const inactiveTabClass = "tab tab-lg";

export async function getValidRoomCode() {
  let roomCode = generateRandomWord(1);
  for (let i = 0; i < 100; i++) {
    if (roomCode instanceof Array) {
      roomCode = roomCode[0];
    } else {
      roomCode = roomCode as string;
    }
    roomCode = roomCode.toLowerCase();
    const q = query(collection(db, "games"), where("roomCode", "==", roomCode));
    const games = await getDocs(q);
    if (
      games.empty ||
      games.docs.every((doc) => doc.data().startedAt !== null)
    ) {
      return roomCode;
    }
  }
  return null;
}

export default function Play() {
  const navigate = useNavigate();
  const addNotification = useAddNotification();
  const user = useUser();
  const [action, setAction] = useState("join");
  const [roomCode, setRoomCode] = useState("");
  const [name, setName] = useState(user.name);

  useEffect(() => {
    const roomCodeInput = document.getElementById(
      "gameIdInput"
    ) as HTMLInputElement;
    roomCodeInput?.focus();
    const btn = document.getElementById("gameBtn") as HTMLButtonElement;
    roomCodeInput?.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        btn?.click();
      }
    });
  }, []);

  function validateRoomCode() {
    if (roomCode.length === 0) {
      addNotification("Room code is required", "warning");
      return null;
    }
    return roomCode.toLowerCase();
  }

  async function updateName() {
    if (name.length === 0) {
      addNotification("Name is required", "warning");
      return null;
    }
    await updateDoc(doc(db, "users", user.uid), { name: name });
    user.name = name;
    return name;
  }

  async function joinGame() {
    const validName = await updateName();
    if (!validName) return;

    const validRoomCode = validateRoomCode();
    if (!validRoomCode) return;
    const games = await getDocs(
      query(collection(db, "games"), where("roomCode", "==", validRoomCode))
    );
    if (games.empty) {
      addNotification("Game not found", "warning");
      return;
    }

    const currentGames = games.docs.reduce((acc, doc) => {
      if (!doc.data().startedAt) {
        acc.push(doc.data());
      }
      return acc;
    }, [] as DocumentData[]);

    if (currentGames.length === 0) {
      addNotification("Game already started", "warning");
      return;
    } else if (currentGames.length > 1) {
      addNotification("Multiple games found", "warning");
      return;
    }

    await updateDoc(doc(db, "games", currentGames[0].uid), {
      players: arrayUnion({ userUid: user.uid, name: user.name, score: 0 }),
    });

    navigate("/game/" + currentGames[0].uid);
  }

  async function hostGame() {
    const validName = await updateName();
    if (!validName) return;
    const roomCode = await getValidRoomCode();
    if (!roomCode) {
      addNotification("Failed to generate room code", "error");
      return;
    }
    const game = newGame(user, roomCode);
    await setDoc(doc(db, "games", game.uid), game);
    navigate("/game/" + game.uid);
  }

  return (
    <>
      <div className="text-2xl font-bold mb-6 text-primary">Play</div>
      <div className="flex flex-col flex-grow w-full">
        <div className="tabs tabs-bordered w-full pb-4">
          <div
            className={action === "join" ? activeTabClass : inactiveTabClass}
          >
            <button onClick={() => setAction("join")}>Join Game</button>
          </div>
          <button
            className={action === "host" ? activeTabClass : inactiveTabClass}
            onClick={() => setAction("host")}
          >
            Host Game
          </button>
        </div>
        <div className="space-y-4">
          <Input
            id="nameInput"
            maxChars={20}
            label="Your Name"
            onChange={setName}
            currentValue={user.name}
          />
          {action === "join" && (
            <Input id="gameIdInput" label="Room Code" onChange={setRoomCode} />
          )}
        </div>
      </div>
      <div className="flex flex-col space-y-2">
        <button
          id="gameBtn"
          className="btn btn-primary w-full"
          onClick={action === "join" ? joinGame : hostGame}
        >
          {action === "join" ? "Join Game" : "Host Game"}
        </button>
        <button className="btn btn-error w-full" onClick={() => navigate("/")}>
          Go back home
        </button>
      </div>
    </>
  );
}
