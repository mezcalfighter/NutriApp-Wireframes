import { useNavigate } from 'react-router';
import { ArrowLeft, Bell, MoreVertical, LogOut, Moon, Sun, Settings, Calendar, DollarSign, AlertCircle, X, Check } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../App';
import { useApp } from '../../contexts/AppContext';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  showNotifications?: boolean;
  showMenu?: boolean;
  role?: 'nutritionist' | 'patient';
}

export default function Header({ title, showBack, showNotifications, showMenu, role }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { isDarkMode, toggleDarkMode, notifications, unreadCount, markNotificationAsRead, markAllNotificationsAsRead, deleteNotification } = useApp();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'appointment':
        return <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
      case 'payment':
        return <DollarSign className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />;
      case 'reminder':
        return <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />;
      default:
        return <Bell className="w-5 h-5 text-slate-600 dark:text-slate-400" />;
    }
  };

  const formatNotificationTime = (createdAt: string) => {
    const date = new Date(createdAt);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Ahora';
    if (diffMins < 60) return `Hace ${diffMins}m`;
    if (diffHours < 24) return `Hace ${diffHours}h`;
    if (diffDays < 7) return `Hace ${diffDays}d`;
    return date.toLocaleDateString('es-MX', { month: 'short', day: 'numeric' });
  };

  const handleNotificationClick = (notification: any) => {
    markNotificationAsRead(notification.id);
    if (notification.appointmentId) {
      navigate(`/nutritionist/appointments/${notification.appointmentId}`);
      setNotificationsOpen(false);
    }
  };

  return (
    <header className="sticky top-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 z-40">
      <div className="flex items-center justify-between px-4 py-4">
        <div className="flex items-center gap-3">
          {showBack && (
            <button
              onClick={() => navigate(-1)}
              className="p-2 -ml-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-slate-700 dark:text-slate-300" />
            </button>
          )}
          <h2 className="text-slate-900 dark:text-white">{title}</h2>
        </div>

        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            title={isDarkMode ? 'Modo Claro' : 'Modo Oscuro'}
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5 text-slate-300" />
            ) : (
              <Moon className="w-5 h-5 text-slate-700 dark:text-slate-300" />
            )}
          </button>

          {/* Notifications */}
          {showNotifications && (
            <div className="relative">
              <button 
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors relative"
              >
                <Bell className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
                )}
              </button>

              {notificationsOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setNotificationsOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-80 max-w-[calc(100vw-2rem)] bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 z-50 max-h-[80vh] flex flex-col">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
                      <h3 className="text-slate-900 dark:text-white font-semibold">Notificaciones</h3>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllNotificationsAsRead}
                          className="text-emerald-600 dark:text-emerald-400 text-sm hover:underline flex items-center gap-1"
                        >
                          <Check className="w-4 h-4" />
                          Marcar todas
                        </button>
                      )}
                    </div>

                    {/* Notifications List */}
                    <div className="overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-8 text-center">
                          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Bell className="w-8 h-8 text-slate-400" />
                          </div>
                          <p className="text-slate-900 dark:text-white mb-2">No hay notificaciones</p>
                          <p className="text-slate-600 dark:text-slate-400 text-sm">
                            Te avisaremos cuando haya algo nuevo
                          </p>
                        </div>
                      ) : (
                        <div className="divide-y divide-slate-200 dark:divide-slate-700">
                          {notifications.map((notification) => (
                            <div
                              key={notification.id}
                              className={`p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer ${
                                !notification.read ? 'bg-blue-50 dark:bg-blue-900/10' : ''
                              }`}
                              onClick={() => handleNotificationClick(notification)}
                            >
                              <div className="flex items-start gap-3">
                                <div className="flex-shrink-0 mt-0.5">
                                  {getNotificationIcon(notification.type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className={`text-sm mb-1 ${
                                    !notification.read 
                                      ? 'text-slate-900 dark:text-white font-semibold' 
                                      : 'text-slate-700 dark:text-slate-300'
                                  }`}>
                                    {notification.title}
                                  </p>
                                  <p className="text-slate-600 dark:text-slate-400 text-sm">
                                    {notification.message}
                                  </p>
                                  <p className="text-slate-500 dark:text-slate-500 text-xs mt-1">
                                    {formatNotificationTime(notification.createdAt)}
                                  </p>
                                </div>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteNotification(notification.id);
                                  }}
                                  className="flex-shrink-0 p-1 text-slate-400 hover:text-red-600 dark:hover:text-red-400 rounded transition-colors"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Menu */}
          {showMenu && (
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                <MoreVertical className="w-5 h-5 text-slate-700 dark:text-slate-300" />
              </button>

              {menuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 py-2 z-50">
                    {role === 'nutritionist' && (
                      <button
                        onClick={() => {
                          navigate('/nutritionist/settings');
                          setMenuOpen(false);
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2 text-slate-700 dark:text-slate-300"
                      >
                        <Settings className="w-4 h-4" />
                        Configuración
                      </button>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-left hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2 text-red-600 dark:text-red-400"
                    >
                      <LogOut className="w-4 h-4" />
                      Cerrar Sesión
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
