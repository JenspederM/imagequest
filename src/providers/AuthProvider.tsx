import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { User } from "../types";
import Login from "../components/Login";
import { auth, db } from "../firebaseConfig";
import {
  DocumentData,
  doc,
  getDoc,
  onSnapshot,
  setDoc,
} from "firebase/firestore";

type AuthContextType = {
  user: User;
};

export const AuthContext = createContext<AuthContextType>({ user: {} as User });

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (user) return;

    const unsub = auth.onAuthStateChanged(async (authUser) => {
      console.log("auth state changed", authUser);
      if (!authUser) {
        setUser(null);
        return;
      }

      // set reference to user document
      const ref = doc(db, "users", authUser.uid);

      // check if user document exists, if not create it
      const userDoc = await getDoc(ref);
      if (!userDoc.exists()) {
        console.log("creating user", ref.path);
        await setDoc(ref, {
          uid: authUser.uid,
          name: "",
          games: [],
        });
      }

      // listen for user document changes
      const unsub = onSnapshot(ref, (doc: DocumentData) => {
        console.log("user updated", ref.path);
        if (!doc.exists()) {
          setUser(null);
          return;
        }
        setUser(doc.data() as User);
      });

      // unsubscribe from user document changes when app unmounts
      return unsub;
    });

    return unsub;
  }, []);

  if (!user) {
    return (
      <div className="absolute inset-0 px-8 py-8 flex flex-col w-full items-center justify-center">
        <Login></Login>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
};

export const useUser = () => {
  return useContext(AuthContext).user;
};

export default AuthProvider;
