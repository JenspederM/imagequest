import { httpsCallable } from "firebase/functions";
import { functions } from "./firebaseConfig";

type GenerateGifRequest = {
  q: string;
  limit: number;
};

type GenerateGifResponse = {
  urls: string[];
};

const generateGif = httpsCallable<GenerateGifRequest, GenerateGifResponse>(
  functions,
  "generateGif"
);

export default {
  generateGif,
};
