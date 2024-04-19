import { Game } from "../types";

export default function Lobby({
  game,
  onStartGame,
}: {
  game: Game;
  onStartGame: () => void;
}) {
  return (
    <div>
      <div className="text-2xl font-bold mb-6">Lobby</div>
      <div>
        Players:
        {game.players.map((player) => (
          <div key={player.userUid}>{player.name}</div>
        ))}
      </div>
      <button
        className="btn btn-primary btn-block"
        onClick={() => onStartGame()}
      >
        Start Game
      </button>
    </div>
  );
}
