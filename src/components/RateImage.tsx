import { useState } from "react";
import { StarRating } from "./StarRating";

export function RateImage(props: {
  src: string;
  theme: string;
  onRate: (rating: number) => void;
}) {
  const [rating, setRating] = useState(0);

  const _setRating = (rating: number) => {
    setRating(rating);
  };

  return (
    <>
      <div className="flex flex-col justify-center">
        <h1 className="text-xl text-center">
          How well does the image look like
        </h1>
        <h1 className="text-2xl font-bold text-center">{props.theme}?</h1>
      </div>
      <div className="flex flex-col flex-grow justify-center items-center space-y-4">
        <img
          className="image-full my-4 p-4 border"
          src={props.src}
          alt="test"
        />
        <StarRating _setRating={_setRating}></StarRating>
      </div>
      <button
        className="btn btn-block btn-success"
        onClick={() => {
          props.onRate(rating);
        }}
      >
        Submit
      </button>
    </>
  );
}
