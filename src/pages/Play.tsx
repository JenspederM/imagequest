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

const activeTabClass = "tab tab-active tab-bordered tab-lg";
const inactiveTabClass = "tab tab-lg";

export default function Play() {
  const navigate = useNavigate();
  const user = useUser();
  const [action, setAction] = useState("join");
  const [roomCode, setRoomCode] = useState("");
  const [name, setName] = useState("");

  async function updateName() {
    console.log("updating name");
    if (name.length === 0) {
      console.log("name is required");
      return false;
    }
    await updateDoc(doc(db, "users", user.uid), { name: name });
    console.log("name updated", name);
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
    console.log("joining game");
    if (roomCode.length === 0) {
      console.log("room code is required");
      return;
    }
    const isValidName = await updateName();
    if (!isValidName) {
      return;
    }
    user.name = name;
    const q = query(collection(db, "games"), where("roomCode", "==", roomCode));
    const games = await getDocs(q);
    if (games.empty) {
      console.log("game not found");
      return;
    }
    const game = games.docs[0].data();
    if (game.startedAt) {
      console.log("game already started at " + game.startedAt);
      return;
    }

    await updateDoc(doc(db, "games", game.uid), {
      players: arrayUnion({ userUid: user.uid, name: user.name, score: 0 }),
    });
    console.log("game joined", game);
    navigate("/game/" + game.uid);
  }

  async function hostGame() {
    console.log("hosting game");
    const isValidName = await updateName();
    if (!isValidName) {
      return;
    }
    user.name = name;
    let roomCode = await getValidRoomCode();
    const game = newGame(user, roomCode);
    await setDoc(doc(db, "games", game.uid), game);
    console.log("game hosted", game);
    navigate("/game/" + game.uid);
  }

  return (
    <>
      <div className="flex flex-col flex-grow w-full">
        <div className="tabs tabs-bordered w-full pt-8 pb-4">
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
          {action === "join" && (
            <Input id="gameIdInput" label="Room Code" onChange={setRoomCode} />
          )}
          <Input
            id="nameInput"
            maxChars={20}
            label="Your Name"
            onChange={setName}
          />
        </div>
      </div>
      <div className="flex flex-col space-y-2">
        <button
          className="btn btn-primary w-full"
          onClick={action === "join" ? joinGame : hostGame}
        >
          {action === "join" ? "Join Game" : "Host Game"}
        </button>
        <button
          className="btn btn-secondary w-full"
          onClick={() => navigate("/")}
        >
          Go back home
        </button>
      </div>
    </>
  );
}