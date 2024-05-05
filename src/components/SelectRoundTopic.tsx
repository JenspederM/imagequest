import { useState } from "react";
import { Topic } from "../types";
import { newTopic } from "../utils";

const topics = [
  "Cats being mischievous",
  "Dancing vegetables",
  "Ridiculous celebrity facial expressions",
  "Animals imitating humans",
  "Superheroes doing mundane tasks",
  "Awkward high fives",
  "Unexpected plot twists in movies",
  "Babies reacting to sour foods",
  "Classic cartoon characters in modern situations",
  "Animals with human-like reactions",
  "Epic fails in sports",
  "Movie scenes recreated with household items",
  "Historical figures photobombing famous events",
  "Dogs wearing sunglasses",
  "Food with faces reacting to being eaten",
  "Unlikely animal friendships",
  "Everyday objects coming to life",
  "Impersonations of famous movie quotes",
  "Dance-offs between unlikely opponents",
  "Objects defying gravity",
];

const short_topics = topics.filter((topic) => topic.length < 27);

export function SelectRoundTopic(props: {
  leader: string;
  isLeader: boolean;
  setRoundTopic: (topic: Topic) => void;
}) {
  const [topic, setTopic] = useState<Topic | null>(null);

  if (!props.isLeader) {
    return (
      <div className="flex flex-grow space- items-center justify-center text-center">
        <div className="flex items-end">
          <h1 className="text-4xl font-bold text-center">
            Waiting <span className="text-5xl">{props.leader}</span> to set the
            topic
          </h1>
          <div className="loading loading-xs loading-dots"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col flex-grow items-center justify-center text-4xl text-center">
        You get to set the topic for this round
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!topic) return;
          props.setRoundTopic(topic);
        }}
      >
        <div className="flex flex-col justify-center space-y-2">
          <input
            className="input input-primary"
            type="text"
            name="round_topic"
            id="round_topic"
            placeholder={`Could be "${
              short_topics[Math.floor(Math.random() * short_topics.length)]
            }"`}
            onChange={(e) => {
              if (!topic) {
                setTopic(newTopic(e.target.value, props.leader));
              } else {
                setTopic(Object.assign(topic, { topic: e.target.value }));
              }
            }}
          />
          <button className="btn btn-block btn-success">Save topic!</button>
        </div>
      </form>
    </>
  );
}
