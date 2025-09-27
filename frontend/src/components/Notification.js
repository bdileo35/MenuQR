import React, { useEffect } from 'react';
import { useNotification } from '../context/NotificationContext';
import { X, CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react';

const iconMap = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

const colorMap = {
  success: 'bg-green-50 border-green-200 text-green-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800',
};

const NotificationItem = ({ notification, onRemove }) => {
  const Icon = iconMap[notification.type];

  useEffect(() => {
    if (notification.duration > 0) {
      const timer = setTimeout(() => {
        onRemove(notification.id);
      }, notification.duration);

      return () => clearTimeout(timer);
    }
  }, [notification, onRemove]);

  return (
    <div className={`rounded-lg border p-4 shadow-lg transition-all duration-300 ${colorMap[notification.type]}`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <Icon className="h-5 w-5" />
        </div>
        <div className="ml-3 flex-1">
          {notification.title && (
            <h4 className="font-medium">{notification.title}</h4>
          )}
          <p className={`text-sm ${notification.title ? 'mt-1' : ''}`}>
            {notification.message}
          </p>
        </div>
        <div className="ml-4 flex-shrink-0">
          <button
            className="inline-flex rounded-md p-1.5 hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-primary-500"
            onClick={() => onRemove(notification.id)}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

const Notification = () => {
  const { notifications, removeNotification } = useNotification();

  if (notifications.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onRemove={removeNotification}
        />
      ))}
    </div>
  );
};

export default Notification;