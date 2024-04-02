import { useState } from "react";

export function SelectRoundTheme(props: {
  leader: string;
  isLeader: boolean;
  setRoundTheme: (theme: string) => void;
}) {
  const [theme, setTheme] = useState("");

  if (!props.isLeader) {
    return (
      <h1 className="text-xl font-bold text-center">
        Waiting for the <span className="text-2xl">{props.leader}</span> to set
        the theme
      </h1>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        props.setRoundTheme(theme);
      }}
      className="flex flex-col flex-grow w-full"
    >
      <div className="flex flex-col flex-grow justify-center">
        <label className="label" htmlFor="round_theme">
          Set round theme
        </label>
        <input
          className="input input-primary"
          type="text"
          name="round_theme"
          id="round_theme"
          onChange={(e) => setTheme(e.target.value)}
        />
      </div>
      <button className="btn btn-block btn-success">Save</button>
    </form>
  );
}
