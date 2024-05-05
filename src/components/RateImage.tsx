import { useEffect, useState } from "react";
import { StarRating } from "./StarRating";
import { Image, Rating, Topic, User } from "../types";
import { newRating } from "../utils";

export function RateImage(props: {
  user: User;
  images: Image[];
  topic: Topic;
  onRate: (ratings: Rating[]) => void;
}) {
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    if (props.images.every((i) => ratings.find((r) => i.uid === r.imageUid))) {
      setIsDone(true);
    }
  }, [ratings]);

  const _setRating = (image: Image, rating: number) => {
    const existingRating = ratings.find((r) => r.imageUid === image.uid);
    if (existingRating) {
      existingRating.rating = rating;
      setRatings([...ratings]);
      return;
    }
    setRatings([...ratings, newRating(image, props.user.uid, rating)]);
  };

  return (
    <>
      <div className="flex flex-col justify-center">
        <h1 className="text-xl text-center">
          How well does the image look like
        </h1>
        <h1 className="text-2xl font-bold text-center">{props.topic.topic}?</h1>
      </div>
      <div className="flex flex-col flex-grow items-center overflow-y-auto mt-4 mb-2 space-y-6">
        {props.images.map((image, i) => {
          return (
            <div
              className="flex flex-col items-center space-y-2 border py-4 border-neutral"
              key={i}
            >
              <img
                className="object-contain rounded-md w-4/5"
                src={image.src}
                alt="test"
              />
              <StarRating image={image} setRating={_setRating}></StarRating>
            </div>
          );
        })}
      </div>
      <button
        className="btn btn-block btn-success"
        disabled={!isDone}
        onClick={() => props.onRate(ratings)}
      >
        Submit
      </button>
    </>
  );
}
