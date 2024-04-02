import { useState } from "react";
import api from "../api";

export function DrawImage(props: {
  theme: string;

  onSave: (image: string) => void;
}) {
  const [selected, setSelected] = useState(null as number | null);
  const [query, setQuery] = useState("");
  const [image, setImage] = useState([] as { url: string; toggled: boolean }[]);

  return (
    <>
      <div className="flex flex-col justify-center">
        <h1 className="text-xl text-center">Draw something that looks like</h1>
        <h1 className="text-2xl font-bold text-center">{props.theme}</h1>
      </div>
      <div className="flex flex-col flex-grow overflow-y-auto mt-4 mb-2">
        {image.length === 0 ? (
          <div className="flex flex-col flex-grow items-center justify-center">
            Generate an image to get started...
          </div>
        ) : (
          <div className="flex flex-col justify-center items-center">
            {image.map((img, i) => (
              <div
                key={i}
                className="flex items-center justify-center h-[256px] w-[256px] mb-2"
              >
                <button
                  onClick={() => {
                    const newImages = [...image];
                    newImages.forEach((img) => (img.toggled = false));
                    newImages[i].toggled = !newImages[i].toggled;
                    setImage(newImages);
                    setSelected(i);
                  }}
                >
                  <img
                    className={
                      "image-full border" +
                      (img.toggled ? " border-4 border-primary" : "")
                    }
                    src={img.url}
                    alt={`drawn-image-${i}`}
                  />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="flex flex-col w-full justify-center space-y-2">
        <input
          className="input input-primary w-full"
          type="text"
          placeholder="Search for a gif..."
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          className="btn btn-block btn-primary"
          onClick={async () => {
            const newUrls = await api.generateGif(query, 3);
            const newImages = newUrls.map((url) => ({ url, toggled: false }));
            setImage([...image, ...newImages]);
          }}
        >
          Generate
        </button>
        <button
          className="btn btn-block btn-success"
          disabled={image.length === 0}
          onClick={() => {
            if (selected === null) {
              return;
            }
            props.onSave(image[selected].url);
          }}
        >
          Submit
        </button>
      </div>
    </>
  );
}
