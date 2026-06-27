import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import { 
  FileText, Calendar, CheckSquare, Award, AlertTriangle, 
  ArrowRight, Briefcase, GraduationCap, Clock 
} from 'lucide-react';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [apps, setApps] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      const [profileRes, appsRes, interviewsRes] = await Promise.all([
        API.get(`/api/student/profile/${user.userId}`),
        API.get(`/api/student/applications/${user.userId}`),
        API.get(`/api/student/interviews/${user.userId}`)
      ]);
      
      setProfile(profileRes.data);
      setApps(appsRes.data);
      setInterviews(interviewsRes.data.filter(i => i.status === 'SCHEDULED'));
    } catch (err) {
      console.error('Failed to load student dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  // Calculate profile completion metrics
  const checklist = [
    { name: 'Basic Details (Name, Phone)', done: !!(profile?.name && profile?.phone) },
    { name: 'Academic Records (Department, Branch)', done: !!(profile?.department && profile?.branch) },
    { name: 'CGPA & Graduation Year', done: !!(profile?.cgpa && profile?.passingYear) },
    { name: 'Upload Resume PDF', done: !!profile?.resumePath },
    { name: 'Skills & Experience Details', done: !!profile?.skills },
  ];
  const completedCount = checklist.filter(c => c.done).length;
  const completionPercent = Math.round((completedCount / checklist.length) * 100);

  const selectedApps = apps.filter(a => a.status === 'SELECTED');

  return (
    <div className="space-y-6">
      
      {/* Verification Warning Alert */}
      {profile && !profile.isVerified && (
        <div className="bg-amber-500/10 border border-amber-500/30 text-amber-400 p-4 rounded-2xl flex items-start gap-3 shadow-lg">
          <AlertTriangle className="h-6 w-6 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-slate-200 text-sm">Account Under Verification</h4>
            <p className="text-xs text-slate-400 mt-1">
              Your academic profile is currently under review by the Placement Officer. Once verified, you will be eligible to apply for open job postings. Ensure all records (CGPA, Branch) are filled accurately.
            </p>
          </div>
        </div>
      )}

      {/* Selected celebration banner */}
      {selectedApps.length > 0 && (
        <div className="bg-gradient-to-r from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 text-emerald-400 p-6 rounded-2xl flex items-center justify-between shadow-xl">
          <div className="space-y-1">
            <h4 className="font-bold text-slate-200 text-lg flex items-center gap-2">
              🎉 Congratulations!
            </h4>
            <p className="text-sm text-slate-400">
              You have been selected for the position of <span className="font-semibold text-emerald-300">{selectedApps[0].jobTitle}</span> at <span className="font-semibold text-emerald-300">{selectedApps[0].companyName}</span>! Check your email and applications tab for onboarding guidelines.
            </p>
          </div>
          <Award className="h-14 w-14 text-emerald-400 hidden sm:block animate-bounce" />
        </div>
      )}

      {/* Statistics Cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="glass-card p-5 rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Applied Jobs</p>
            <h3 className="text-2xl font-bold mt-0.5">{apps.length}</h3>
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-yellow-400">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Under Review</p>
            <h3 className="text-2xl font-bold mt-0.5">{apps.filter(a => a.status === 'UNDER_REVIEW' || a.status === 'APPLIED').length}</h3>
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl text-purple-400">
            <Calendar className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Interviews</p>
            <h3 className="text-2xl font-bold mt-0.5">{interviews.length}</h3>
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
            <Award className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Offers Received</p>
            <h3 className="text-2xl font-bold mt-0.5">{selectedApps.length}</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Profile Completion Checklist */}
        <div className="glass-panel p-6 rounded-2xl lg:col-span-2 space-y-5">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-slate-200">Profile Readiness</h3>
            <span className="text-xs text-primary-400 font-semibold">{completionPercent}% Ready</span>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
            <div className="bg-primary-500 h-full rounded-full transition-all duration-500" style={{ width: `${completionPercent}%` }} />
          </div>

          <div className="space-y-3 pt-2">
            {checklist.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3.5 bg-slate-950/40 border border-slate-900 rounded-xl">
                <span className="text-xs font-medium text-slate-300">{item.name}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.done ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                  {item.done ? 'COMPLETED' : 'PENDING'}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-2 text-right">
            <Link to="/student/profile" className="inline-flex items-center text-xs font-bold text-primary-400 hover:text-primary-300 transition-colors">
              Update Academic Profile <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* Upcoming interviews list */}
        <div className="glass-panel p-6 rounded-2xl space-y-4">
          <h3 className="font-bold text-slate-200">Upcoming Interviews</h3>
          <div className="space-y-3">
            {interviews.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-xs">
                No interviews scheduled currently.
              </div>
            ) : (
              interviews.map((i) => (
                <div key={i.id} className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                  <div className="flex justify-between items-start">
                    <span className="font-semibold text-xs text-slate-200">{i.jobTitle}</span>
                    <span className="text-[10px] font-bold bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded-full">{i.mode}</span>
                  </div>
                  <p className="text-[10px] text-slate-500">{i.companyName}</p>
                  <div className="text-[11px] text-slate-400 border-t border-slate-800 pt-2 flex justify-between">
                    <span>{new Date(i.date).toLocaleDateString()}</span>
                    <span>{i.time}</span>
                  </div>
                  {i.mode === 'ONLINE' && i.meetingLink && (
                    <a 
                      href={i.meetingLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="block text-center mt-2 text-xs bg-primary-600 hover:bg-primary-500 text-white font-semibold py-1.5 rounded-lg transition-colors"
                    >
                      Join Meeting
                    </a>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default StudentDashboard;
