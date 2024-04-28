import { useState } from "react";
import { Input } from "../components/Input";
import { newGame } from "../utils";
import {
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
import { generate as generateRandomWord } from "random-words";
import { useAddNotification } from "../providers/NotificationProvider";

const activeTabClass = "tab tab-active tab-bordered tab-lg";
const inactiveTabClass = "tab tab-lg";

export default function Play() {
  const navigate = useNavigate();
  const addNotification = useAddNotification();
  const user = useUser();
  const [action, setAction] = useState("join");
  const [roomCode, setRoomCode] = useState("");
  const [name, setName] = useState("");

  async function updateName() {
    console.debug("updating name");
    if (name.length === 0) {
      console.debug("name is required");
      addNotification("Name is required", "warning");
      return false;
    }
    await updateDoc(doc(db, "users", user.uid), { name: name });
    console.debug("name updated", name);
    return true;
  }

  async function getValidRoomCode() {
    let roomCode = generateRandomWord(1);
    if (roomCode instanceof Array) {
      roomCode = roomCode[0];
    } else {
      roomCode = roomCode as string;
    }
    const q = query(collection(db, "games"), where("roomCode", "==", roomCode));
    const games = await getDocs(q);
    if (
      games.empty ||
      games.docs.every((doc) => doc.data().startedAt !== null)
    ) {
      return roomCode;
    }
    return getValidRoomCode();
  }

  async function joinGame() {
    console.debug("joining game");
    const isValidName = await updateName();
    if (!isValidName) {
      return;
    }
    if (roomCode.length === 0) {
      console.debug("room code is required");
      addNotification("Room code is required", "warning");
      return;
    }
    user.name = name;
    const q = query(collection(db, "games"), where("roomCode", "==", roomCode));
    const games = await getDocs(q);
    if (games.empty) {
      console.debug("game not found");
      addNotification("Game not found", "warning");
      return;
    }
    const game = games.docs[0].data();
    if (game.startedAt) {
      console.debug("game already started at " + game.startedAt);
      addNotification("Game already started at" + game.startedAt, "warning");
      return;
    }

    await updateDoc(doc(db, "games", game.uid), {
      players: arrayUnion({ userUid: user.uid, name: user.name, score: 0 }),
    });
    console.debug("game joined", game);
    navigate("/game/" + game.uid);
  }

  async function hostGame() {
    console.debug("hosting game");
    const isValidName = await updateName();
    if (!isValidName) {
      return;
    }
    user.name = name;
    let roomCode = await getValidRoomCode();
    const game = newGame(user, roomCode);
    await setDoc(doc(db, "games", game.uid), game);
    console.debug("game hosted", game);
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
          />
          {action === "join" && (
            <Input id="gameIdInput" label="Room Code" onChange={setRoomCode} />
          )}
        </div>
      </div>
      <div className="flex flex-col space-y-2">
        <button
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
