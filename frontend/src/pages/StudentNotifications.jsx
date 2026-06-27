import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import { Bell, Check, Clock, Trash } from 'lucide-react';

const StudentNotifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const res = await API.get(`/api/student/notifications/${user.userId}`);
      setNotifications(res.data);
    } catch (err) {
      console.error('Failed to load notifications', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await API.put(`/api/student/notifications/${id}/read`);
      // Update local state
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, isRead: true } : n)
      );
    } catch (err) {
      console.error('Failed to mark as read', err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-200">Alerts & Notifications</h2>
        <span className="text-xs text-slate-500 font-semibold">{notifications.filter(n => !n.isRead).length} Unread</span>
      </div>

      {notifications.length === 0 ? (
        <div className="glass-panel text-center py-20 rounded-2xl text-slate-500 text-sm font-semibold">
          No notifications found.
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <div 
              key={n.id} 
              className={`glass-panel p-4 rounded-xl flex items-start gap-4 transition-all ${
                !n.isRead ? 'bg-primary-500/5 border-l-2 border-l-primary-500 shadow-md' : 'opacity-80'
              }`}
            >
              <div className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                !n.isRead ? 'bg-primary-500/10 text-primary-400' : 'bg-slate-950 text-slate-500'
              }`}>
                <Bell className="h-4 w-4" />
              </div>
              
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex justify-between items-start gap-2">
                  <h4 className={`text-sm font-semibold ${!n.isRead ? 'text-slate-100' : 'text-slate-300'}`}>{n.title}</h4>
                  <span className="text-[10px] text-slate-500 flex items-center gap-1 shrink-0">
                    <Clock className="h-3 w-3" />
                    {new Date(n.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{n.message}</p>
              </div>

              {!n.isRead && (
                <button
                  onClick={() => handleMarkRead(n.id)}
                  className="p-1 text-slate-500 hover:text-emerald-400 rounded-lg hover:bg-slate-800 transition-all shrink-0 self-center"
                  title="Mark as Read"
                >
                  <Check className="h-4.5 w-4.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentNotifications;
