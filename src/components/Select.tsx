export function Select(props: {
  id: string;
  label: string;
  value: string;
  options: string[];
  onChange: (e: string) => void;
}) {
  return (
    <div className="flex flex-col w-full space-y-2">
      <label htmlFor={props.id}>{props.label}</label>
      <select
        id={props.id}
        className="select select-primary w-full"
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
      >
        {props.options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}
