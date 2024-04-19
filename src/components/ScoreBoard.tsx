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
      <div className="flex flex-col flex-grow">
        <table className="table table-pin-rows">
          <thead>
            <tr>
              <th></th>
              <td>Player</td>
              <td>Score</td>
            </tr>
          </thead>
          <tbody>
            {props.total
              .sort((a, b) => b.score - a.score)
              .map((score, i) => {
                return (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td>{score.name}</td>
                    <td>{score.score}</td>
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
