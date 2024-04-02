import { Score } from "../types";

export function ScoreBoard(props: {
  total: Score[];
  nextRound?: () => void;
  finishGame?: () => void;
}) {
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
            {props.total.map((score, i) => {
              console.log(score);
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
          >
            Next Round
          </button>
        )}
        {props.finishGame && (
          <button
            className="btn btn-success btn-block"
            onClick={props.finishGame}
          >
            Finish Game
          </button>
        )}
      </div>
    </>
  );
}
