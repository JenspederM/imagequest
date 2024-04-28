import { httpsCallable } from "firebase/functions";
import { functions } from "./firebaseConfig";
import { GenerateGifRequest, GenerateGifResponse } from "./types";

const generateGif = httpsCallable<GenerateGifRequest, GenerateGifResponse>(
  functions,
  "generateGif"
);

const generateOpenAiImage = httpsCallable<
  GenerateGifRequest,
  GenerateGifResponse
>(functions, "generateOpenAiImage");

export default {
  generateGif,
  generateOpenAiImage,
};
