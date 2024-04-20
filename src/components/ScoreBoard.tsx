import { useNavigate } from "react-router-dom";
import { Score } from "../types";

export function ScoreBoard(props: {
  total: Score[];
  isHost: boolean;
  nextRound?: () => void;
  finishGame?: () => void;
}) {
  const navigate = useNavigate();

  return (
    <>
      <div className="text-2xl font-bold mb-6 text-primary">Scoreboard</div>
      <div className="flex flex-col flex-grow">
        <table className="table table-pin-rows">
          <thead>
            <tr>
              <th></th>
              <td className="text-center">Player</td>
              <td className="text-center">Score</td>
            </tr>
          </thead>
          <tbody>
            {props.total
              .sort((a, b) => b.score - a.score)
              .map((score, i) => {
                return (
                  <tr key={i}>
                    <td className="text-center">{i + 1}</td>
                    <td className="text-center">{score.name}</td>
                    <td className="text-center">{score.score}</td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
      <div className="w-full flex flex-col space-y-2">
        {props.nextRound && (
          <button
            className="btn btn-primary btn-block"
            onClick={props.nextRound}
            disabled={!props.isHost}
          >
            Next Round
          </button>
        )}
        {props.finishGame && (
          <button
            className="btn btn-success btn-block"
            onClick={props.finishGame}
            disabled={!props.isHost}
          >
            Finish Game
          </button>
        )}
        {!props.nextRound && !props.finishGame && (
          <button className="btn btn-primary" onClick={() => navigate("/")}>
            Go back home
          </button>
        )}
      </div>
    </>
  );
}
