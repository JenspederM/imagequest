import { useState } from "react";
import api from "../api";

type TogglableImage = {
  url: string;
  toggled: boolean;
};

type ImageGroupType = {
  query: string;
  collapsed: boolean;
  images: TogglableImage[];
};

export function DrawImage(props: {
  theme: string;
  onSave: (image: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [imageGroups, setImageGroups] = useState<ImageGroupType[]>([]);
  const [selected, setSelected] = useState<TogglableImage | null>(null);

  return (
    <>
      <div className="flex flex-col justify-center">
        <h1 className="text-xl text-center">Draw something that looks like</h1>
        <h1 className="text-2xl font-bold text-center">{props.theme}</h1>
      </div>
      <div className="flex flex-col flex-grow overflow-y-auto mt-4 mb-2">
        {imageGroups.length === 0 ? (
          <div className="flex flex-col flex-grow items-center justify-center">
            Generate an image to get started...
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-4">
            {imageGroups.map((group, i) => {
              return (
                <div key={i} className="collapse bg-base-200 text-center">
                  <input
                    type="checkbox"
                    name={group.query}
                    checked={group.collapsed}
                    onChange={(e) => {
                      const newImages = [...imageGroups];
                      newImages[i].collapsed = !newImages[i].collapsed;
                      setImageGroups(newImages);
                      console.log(
                        "clicked collapse",
                        e.target.name,
                        e.target.checked,
                        newImages[i].collapsed
                      );
                    }}
                  />
                  <div className="collapse-title font-bold">{group.query}</div>
                  <div className="collapse-content flex flex-col items-center">
                    {group.images.map((img, j) => (
                      <div
                        key={`${i}${j}`}
                        className="flex items-center justify-center w-[256px] mb-2"
                      >
                        <button
                          onClick={() => {
                            const newImages = [...imageGroups];
                            newImages.forEach((group) =>
                              group.images.forEach(
                                (img) => (img.toggled = false)
                              )
                            );
                            img.toggled = true;
                            setImageGroups(newImages);
                            setSelected(img);
                          }}
                        >
                          <img
                            className={
                              "image-full border" +
                              (img.toggled ? " border-4 border-primary" : "")
                            }
                            src={img.url}
                            alt={`drawn-image-${i}-${j}`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
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
            const newUrls = await api.generateGif({
              data: { q: query, limit: 3 },
            });
            console.log(newUrls);
            const newImages = newUrls.data.urls.map((url) => ({
              url,
              toggled: false,
            }));
            setImageGroups([
              ...imageGroups,
              { query, collapsed: true, images: newImages },
            ]);
          }}
        >
          Generate
        </button>
        <button
          className="btn btn-block btn-success"
          disabled={imageGroups.length === 0}
          onClick={() => {
            if (selected === null) {
              return;
            }
            props.onSave(selected.url);
          }}
        >
          Submit
        </button>
      </div>
    </>
  );
}
