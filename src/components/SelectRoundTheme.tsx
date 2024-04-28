import { useState } from "react";

export function SelectRoundTheme(props: {
  leader: string;
  isLeader: boolean;
  setRoundTheme: (theme: string) => void;
}) {
  const [theme, setTheme] = useState("");

  if (!props.isLeader) {
    return (
      <div className="flex flex-grow space- items-center justify-center text-center">
        <div className="flex items-end">
          <h1 className="text-4xl font-bold text-center">
            Waiting <span className="text-5xl">{props.leader}</span> to set the
            theme
          </h1>
          <div className="loading loading-xs loading-dots"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col flex-grow items-center justify-center text-4xl text-center">
        You get to set the theme for this round
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          props.setRoundTheme(theme);
        }}
      >
        <div className="flex flex-col flex-grow justify-center space-y-2">
          <input
            className="input input-primary"
            type="text"
            name="round_theme"
            id="round_theme"
            placeholder="Enter a theme here"
            onChange={(e) => setTheme(e.target.value)}
          />
          <button className="btn btn-block btn-success">Save theme!</button>
        </div>
      </form>
    </>
  );
}
