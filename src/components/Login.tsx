import {
  FacebookAuthProvider,
  GoogleAuthProvider,
  signInAnonymously,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../firebaseConfig";
import { useState } from "react";
import ThemeSelect from "../components/ThemeSelect";
import { delay } from "../utils";
import { AnonymousLogo } from "../icons/AnonymousLogo";
import { FacebookLogo } from "../icons/FacebookLogo";
import { GoogleLogo } from "../icons/GoogleLogo";

type SignInMethod = "Anonymously" | "Google" | "Facebook";
const ConsentModalId = "consentModal";

const getConsentModal = async () => {
  let modal = document.getElementById(ConsentModalId);

  while (!modal) {
    await delay(100);
    modal = document.getElementById(ConsentModalId);
  }

  return modal;
};

export default function Login() {
  const [signInMethod, setSignInMethod] = useState<SignInMethod>("Anonymously");

  const openConsentModal = async (signInMethod: SignInMethod) => {
    setSignInMethod(signInMethod);
    const modal = await getConsentModal();
    modal.classList.add("modal-open");
  };

  const closeConsentModal = async () => {
    const modal = await getConsentModal();
    modal.classList.remove("modal-open");
  };

  const signIn = async () => {
    switch (signInMethod) {
      case "Anonymously":
        await signInAnonymously(auth);
        break;
      case "Google":
        await signInWithPopup(auth, new GoogleAuthProvider()).catch((err) => {
          if (err.code === "auth/popup-closed-by-user") {
            return;
          }

          console.error(err);
        });
        break;
      case "Facebook":
        await signInWithPopup(auth, new FacebookAuthProvider());
        break;
      default:
        console.error("Unknown auth type");
        break;
    }
  };

  const signInWithConsent = async () => {
    const modal = await getConsentModal();
    modal.classList.remove("modal-open");
    await signIn();
  };

  return (
    <>
      <ConsentModal
        id={ConsentModalId}
        close={closeConsentModal}
        signIn={signInWithConsent}
      />
      <div className="text-5xl font-bold mb-12 text-primary">Login Now!</div>
      <div className="space-y-6 max-w-xs">
        <button
          className="btn btn-primary btn-block"
          onClick={() => openConsentModal("Anonymously")}
        >
          <AnonymousLogo />
          Anonymous
        </button>
        <button
          className="btn btn-primary btn-block"
          onClick={() => openConsentModal("Facebook")}
        >
          <FacebookLogo />
          Facebook
        </button>
        <button
          className="btn btn-primary btn-block"
          onClick={() => openConsentModal("Google")}
        >
          <GoogleLogo />
          Google
        </button>
      </div>
    </>
  );
}

function ConsentModal({
  id,
  close,
  signIn,
}: {
  id: string;
  close: () => void;
  signIn: () => void;
}) {
  return (
    <div className="modal" id={id}>
      <div className="modal-box flex flex-col h-full w-full">
        <div className="flex flex-col flex-grow overflow-y-auto px-4">
          <h1 className="text-2xl font-bold divider">Personalization</h1>
          <div className="space-y-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text">
                  Select your preferred language
                </span>
              </label>
              <select
                data-choose-theme
                className="select select-bordered border-primary focus:outline-primary w-full"
                defaultValue={"English"}
              >
                {["English", "German", "French", "Spanish", "Danish"].map(
                  (option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  )
                )}
              </select>
            </div>

            <ThemeSelect />
          </div>

          <h1 className="text-2xl font-bold divider">Cookies & Privacy</h1>
          <div className="space-y-4 w-full">
            <div className="text-justify">
              By using this application, you consent to the use of Google
              Analytics for the purpose of collecting and analyzing usage data.
            </div>
            <div className="text-justify">
              This data, which may include information about your device,
              location, and usage patterns, will be used to improve the
              performance and user experience of the app.
            </div>
          </div>
        </div>
        <div className="divider" />
        <div className="flex justify-between space-x-2">
          <button className="btn btn-error w-2/5" onClick={close}>
            Cancel
          </button>
          <button className="btn btn-primary w-2/5" onClick={signIn}>
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
