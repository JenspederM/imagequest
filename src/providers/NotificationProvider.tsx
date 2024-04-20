import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

type Notification = {
  type: "info" | "success" | "error" | "warning";
  message: string;
};

type NotificationContextType = {
  notifications: Notification[];
  addNotification: (message: string, type: string) => void;
};

export const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  addNotification: () => null,
});

export function NotificationProvider({ children }: PropsWithChildren) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (notifications.length > 0) {
        setNotifications((prev) => prev.slice(1));
      }
    }, 3000);

    return () => clearInterval(timer);
  }, [notifications]);

  const styleMap = {
    info: "alert alert-info",
    success: "alert alert-success",
    error: "alert alert-error",
    warning: "alert alert-warning",
  };

  function addNotification(message: string, type: string) {
    setTimeout(() => {
      setNotifications((prev) => prev.slice(1));
    }, 3000);
    setNotifications((prev) => [...prev, { message, type } as Notification]);
  }

  return (
    <NotificationContext.Provider value={{ notifications, addNotification }}>
      {children}
      <div className="toast toast-center">
        {notifications.map((notification, i) => (
          <div key={i} className={styleMap[notification.type]}>
            {notification.message}
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
}

export const useAddNotification = () => {
  const { addNotification } = useContext(NotificationContext);
  return addNotification;
};
