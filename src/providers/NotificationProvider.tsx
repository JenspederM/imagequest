import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

type Notification = {
  type: "info" | "success";
  message: string;
};

type NotificationContextType = {
  notifications: Notification[];
  addNotification: (notification: Notification) => void;
};

export const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  addNotification: (_: Notification) => null,
});

export function NotificationProvider({ children }: PropsWithChildren) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const newNoti = [
      {
        type: "info",
        message: "New mail arrived.",
      },
      {
        type: "success",
        message: "Message sent successfully.",
      },
    ] as Notification[];

    newNoti.forEach((noti) => {
      addNotification(noti);
    });
  }, []);

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
  };

  function addNotification(notification: Notification) {
    setTimeout(() => {
      setNotifications((prev) => prev.slice(1));
    }, 3000);
    setNotifications((prev) => [...prev, notification]);
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
