export function StarRating(props: { _setRating: (rating: number) => void }) {
  return (
    <div className="rating rating-lg rating-half">
      <input
        type="radio"
        name="rating-10"
        className="rating-hidden"
        defaultChecked
        onChange={() => props._setRating(0)}
      />
      <input
        type="radio"
        name="rating-10"
        className="bg-green-500 mask mask-star-2 mask-half-1"
        onChange={() => props._setRating(0.5)}
      />
      <input
        type="radio"
        name="rating-10"
        className="bg-green-500 mask mask-star-2 mask-half-2"
        onChange={() => props._setRating(1)}
      />
      <input
        type="radio"
        name="rating-10"
        className="bg-green-500 mask mask-star-2 mask-half-1"
        onChange={() => props._setRating(1.5)}
      />
      <input
        type="radio"
        name="rating-10"
        className="bg-green-500 mask mask-star-2 mask-half-2"
        onChange={() => props._setRating(2)}
      />
      <input
        type="radio"
        name="rating-10"
        className="bg-green-500 mask mask-star-2 mask-half-1"
        onChange={() => props._setRating(2.5)}
      />
      <input
        type="radio"
        name="rating-10"
        className="bg-green-500 mask mask-star-2 mask-half-2"
        onChange={() => props._setRating(3)}
      />
      <input
        type="radio"
        name="rating-10"
        className="bg-green-500 mask mask-star-2 mask-half-1"
        onChange={() => props._setRating(3.5)}
      />
      <input
        type="radio"
        name="rating-10"
        className="bg-green-500 mask mask-star-2 mask-half-2"
        onChange={() => props._setRating(4)}
      />
      <input
        type="radio"
        name="rating-10"
        className="bg-green-500 mask mask-star-2 mask-half-1"
        onChange={() => props._setRating(4.5)}
      />
      <input
        type="radio"
        name="rating-10"
        className="bg-green-500 mask mask-star-2 mask-half-2"
        onChange={() => props._setRating(5)}
      />
    </div>
  );
}
