import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import { Calendar, Clock, Video, FileText, ExternalLink } from 'lucide-react';

const StudentInterviews = () => {
  const { user } = useAuth();
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchInterviews();
    }
  }, [user]);

  const fetchInterviews = async () => {
    try {
      const res = await API.get(`/api/student/interviews/${user.userId}`);
      setInterviews(res.data);
    } catch (err) {
      console.error('Failed to load interviews', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'COMPLETED': return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
      case 'CANCELLED': return 'bg-red-500/10 text-red-400 border border-red-500/20';
      case 'RESCHEDULED': return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
      default: return 'bg-purple-500/10 text-purple-400 border border-purple-500/20'; // SCHEDULED
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
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-slate-200">Interview Schedules</h2>

      {interviews.length === 0 ? (
        <div className="glass-panel text-center py-20 rounded-2xl text-slate-500 text-sm font-semibold">
          No interviews have been scheduled for you yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {interviews.map((i) => (
            <div key={i.id} className="glass-panel p-6 rounded-2xl flex flex-col justify-between gap-4">
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-slate-200 text-sm">{i.jobTitle}</h3>
                    <p className="text-xs text-primary-400 font-semibold mt-0.5">{i.companyName}</p>
                  </div>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${getStatusColor(i.status)}`}>
                    {i.status}
                  </span>
                </div>

                <div className="space-y-2 pt-3 border-t border-slate-800/80 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-slate-500" />
                    <span>Date: {new Date(i.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-slate-500" />
                    <span>Time: {i.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Video className="h-4 w-4 text-slate-500" />
                    <span>Mode: <span className="font-semibold text-slate-200">{i.mode}</span></span>
                  </div>
                </div>
              </div>

              {/* meeting link or feedback */}
              <div className="space-y-3 pt-2">
                {i.mode === 'ONLINE' && i.meetingLink && i.status === 'SCHEDULED' && (
                  <a 
                    href={i.meetingLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-500 text-white font-semibold py-2 rounded-xl text-xs transition-colors"
                  >
                    Join Meeting Room <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}

                {i.feedback && (
                  <div className="bg-slate-950/40 p-4 border border-slate-900 rounded-xl space-y-1 text-xs">
                    <span className="font-semibold text-slate-400 uppercase tracking-wider text-[9px] flex items-center gap-1">
                      <FileText className="h-3 w-3" /> Interviewer Feedback
                    </span>
                    <p className="text-slate-300 leading-relaxed italic">"{i.feedback}"</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentInterviews;
