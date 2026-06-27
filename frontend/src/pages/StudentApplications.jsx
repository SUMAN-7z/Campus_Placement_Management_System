import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import { FileText, Calendar, Building2, CheckCircle, Clock, XCircle, ChevronRight } from 'lucide-react';

const StudentApplications = () => {
  const { user } = useAuth();
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchApplications();
    }
  }, [user]);

  const fetchApplications = async () => {
    try {
      const res = await API.get(`/api/student/applications/${user.userId}`);
      setApps(res.data);
    } catch (err) {
      console.error('Failed to load applications', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'SELECTED': return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
      case 'REJECTED': return 'bg-red-500/10 text-red-400 border border-red-500/20';
      case 'SHORTLISTED': return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
      case 'INTERVIEW_SCHEDULED': return 'bg-purple-500/10 text-purple-400 border border-purple-500/20';
      case 'UNDER_REVIEW': return 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20';
      default: return 'bg-slate-800 text-slate-400 border border-slate-700';
    }
  };

  const steps = ['APPLIED', 'UNDER_REVIEW', 'SHORTLISTED', 'INTERVIEW_SCHEDULED', 'SELECTED'];

  const getStepIndex = (status) => {
    if (status === 'REJECTED') return -1;
    return steps.indexOf(status);
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
      <h2 className="text-xl font-bold text-slate-200">Track Applications</h2>
      
      {apps.length === 0 ? (
        <div className="glass-panel text-center py-20 rounded-2xl text-slate-500 text-sm font-semibold">
          You haven't submitted any job applications yet.
        </div>
      ) : (
        <div className="space-y-6">
          {apps.map((app) => {
            const currentStep = getStepIndex(app.status);
            const isRejected = app.status === 'REJECTED';
            
            return (
              <div key={app.id} className="glass-panel p-6 rounded-2xl space-y-6">
                
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-center text-primary-400 shrink-0">
                      <Building2 className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-200 text-base">{app.jobTitle}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">{app.companyName}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-slate-500 flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      Applied: {new Date(app.appliedAt).toLocaleDateString()}
                    </span>
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${getStatusColor(app.status)}`}>
                      {app.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                {/* Progress bar / pipeline visualization */}
                {!isRejected ? (
                  <div className="relative pt-2">
                    <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-950 -translate-y-1/2 rounded-full -z-10" />
                    <div className="grid grid-cols-5 text-center gap-2">
                      {steps.map((step, idx) => {
                        const isDone = idx <= currentStep;
                        const isCurrent = idx === currentStep;
                        
                        return (
                          <div key={step} className="flex flex-col items-center gap-2">
                            <div className={`h-6 w-6 rounded-full flex items-center justify-center border-2 transition-all ${
                              isCurrent 
                                ? 'bg-primary-600 border-primary-500 text-white shadow-[0_0_10px_rgba(2,132,199,0.5)]' 
                                : isDone 
                                  ? 'bg-slate-900 border-primary-600 text-primary-400' 
                                  : 'bg-slate-950 border-slate-800 text-slate-600'
                            }`}>
                              <CheckCircle className="h-3.5 w-3.5" />
                            </div>
                            <span className={`text-[9px] font-bold uppercase tracking-wider hidden sm:block ${
                              isCurrent ? 'text-primary-400 font-semibold' : isDone ? 'text-slate-300' : 'text-slate-600'
                            }`}>
                              {step.replace('_', ' ')}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="bg-red-500/5 border border-red-500/20 p-4 rounded-xl flex items-center gap-3">
                    <XCircle className="h-5 w-5 text-red-400 shrink-0" />
                    <div className="text-xs">
                      <span className="font-bold text-slate-300">Application Closed.</span>
                      <p className="text-slate-500 mt-0.5">Unfortunately, your application was not selected. Feel free to browse and apply for other opportunities.</p>
                    </div>
                  </div>
                )}

                {/* Remarks & Resume block */}
                {app.remarks && (
                  <div className="bg-slate-950/40 p-4 border border-slate-900 rounded-xl space-y-1 text-xs">
                    <span className="font-semibold text-slate-400 uppercase tracking-wider text-[10px]">HR Notes & Feedback</span>
                    <p className="text-slate-300 leading-relaxed">{app.remarks}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default StudentApplications;
