import { useEffect, useState } from "react";
import api from "../api";
import { useAddNotification } from "../providers/NotificationProvider";
import { Topic } from "../types";

type TogglableImage = {
  url: string;
  toggled: boolean;
};

type ImageGroupType = {
  query: string;
  collapsed: boolean;
  images: TogglableImage[];
};

function ClickOnEnter(inputId: string, btnId: string) {
  useEffect(() => {
    const input = document.getElementById(inputId) as HTMLInputElement;
    input?.focus();
    const btn = document.getElementById(btnId) as HTMLButtonElement;
    input?.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        btn?.click();
      }
    });
  }, []);
}

export function DrawImage(props: {
  topic: Topic;
  onSave: (image: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [imageGroups, setImageGroups] = useState<ImageGroupType[]>([]);
  const [selected, setSelected] = useState<TogglableImage | null>(null);
  const [loading, setLoading] = useState(false);
  const addNotification = useAddNotification();
  ClickOnEnter("search", "generate");

  const generateImages = async () => {
    setLoading(true);
    const newUrls = await api
      .generateGif({
        q: query,
        limit: 25,
      })
      .then((res) =>
        res.data.urls.map((url: string) => ({ url: url, toggled: false }))
      )
      .catch((err) => {
        const msg = `There was an error generating images: ${err.message}`;
        addNotification(msg, "error");
      });
    if (!newUrls) {
      addNotification("Failed to generate images", "error");
      setLoading(false);
      return;
    }
    console.debug(newUrls);
    setImageGroups([
      ...imageGroups.map((group) => ({ ...group, collapsed: false })),
      { query, collapsed: true, images: newUrls },
    ]);
    setLoading(false);
  };

  return (
    <>
      <div className="flex flex-col justify-center">
        <h1 className="text-xl text-center">Draw something that looks like</h1>
        <h1 className="text-2xl font-bold text-center">{props.topic.topic}</h1>
      </div>
      <div
        id="image_group_container"
        className="flex flex-col flex-grow overflow-y-auto mt-4 mb-2"
      >
        {imageGroups.length === 0 ? (
          loading ? (
            <div className="flex flex-grow items-center justify-center space-x-2">
              <div className="flex items-end">
                <div className="text-2xl">Generating gifs</div>
                <div className="loading loading-dots loading-xs"></div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col flex-grow text-2xl items-center justify-center">
              Generate a gif to get started
            </div>
          )
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
                      console.debug(
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
            {loading && <div className="loading"></div>}
          </div>
        )}
      </div>
      <div className="flex flex-col w-full justify-center space-y-2">
        <input
          id="search"
          className="input input-primary w-full"
          type="text"
          placeholder="Search for a gif..."
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          id="generate"
          className="btn btn-block btn-primary"
          onClick={generateImages}
        >
          <div>Generate</div>
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
