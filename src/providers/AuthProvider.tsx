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
import { changeTheme, newUser } from "../utils";
import { Splash } from "../components/Splash";

type AuthContextType = {
  user: User;
  signOut: () => void;
};

export const AuthContext = createContext<AuthContextType>({
  user: {} as User,
  signOut: async () => {},
});

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  async function signOut() {
    await auth.signOut();
    setUser(null);
  }

  useEffect(() => {
    if (user) return;

    setTimeout(() => {
      setLoading(false);
    }, 1500);

    const unsub = auth.onAuthStateChanged(async (authUser) => {
      console.debug("auth state changed", authUser);
      if (!authUser) {
        setUser(null);
        return;
      }

      // set reference to user document
      const ref = doc(db, "users", authUser.uid);

      // check if user document exists, if not create it
      const userDoc = await getDoc(ref);
      if (!userDoc.exists()) {
        console.debug("creating user", ref.path);
        await setDoc(ref, newUser(authUser.uid));
      }

      // listen for user document changes
      const unsub = onSnapshot(ref, (doc: DocumentData) => {
        console.debug("user updated", ref.path);
        if (!doc.exists()) {
          setUser(null);
          return;
        }
        const user = doc.data() as User;
        setUser(user);
        changeTheme(user.theme);
      });

      // unsubscribe from user document changes when app unmounts
      return unsub;
    });

    return unsub;
  }, []);

  useEffect(() => {
    if (!user) return;

    setLoading(false);
  }, [user]);

  if (loading) {
    return <Splash></Splash>;
  }

  if (!user) {
    return (
      <div className="absolute inset-0 px-8 py-8 flex flex-col w-full items-center justify-center">
        <Login></Login>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export const useUser = () => {
  return useContext(AuthContext).user;
};

export default AuthProvider;
