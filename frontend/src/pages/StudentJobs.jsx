import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import { Briefcase, Search, MapPin, DollarSign, Award, Calendar, AlertCircle, FileText } from 'lucide-react';

const StudentJobs = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [eligibleJobs, setEligibleJobs] = useState([]);
  const [appliedJobIds, setAppliedJobIds] = useState(new Set());
  const [activeTab, setActiveTab] = useState('eligible'); // eligible or all
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [studentVerified, setStudentVerified] = useState(false);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    try {
      const [allRes, eligibleRes, appliedRes, profileRes] = await Promise.all([
        API.get('/api/student/jobs'),
        API.get(`/api/student/jobs/eligible/${user.userId}`),
        API.get(`/api/student/applications/${user.userId}`),
        API.get(`/api/student/profile/${user.userId}`)
      ]);
      
      setJobs(allRes.data);
      setEligibleJobs(eligibleRes.data);
      setStudentVerified(profileRes.data.isVerified);
      
      const appliedSet = new Set(appliedRes.data.map(app => app.jobId));
      setAppliedJobIds(appliedSet);
    } catch (err) {
      console.error('Failed to load jobs data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (jobId) => {
    setMessage({ text: '', type: '' });
    try {
      await API.post('/api/student/jobs/apply', { userId: user.userId, jobId });
      setMessage({ text: 'Application submitted successfully!', type: 'success' });
      // Reload applied state
      loadData();
    } catch (err) {
      setMessage({ text: err.response?.data?.message || 'Failed to apply.', type: 'error' });
    }
  };

  const handleWithdraw = async (jobId) => {
    setMessage({ text: '', type: '' });
    try {
      await API.delete(`/api/student/jobs/withdraw?userId=${user.userId}&jobId=${jobId}`);
      setMessage({ text: 'Application withdrawn successfully.', type: 'success' });
      loadData();
    } catch (err) {
      setMessage({ text: err.response?.data?.message || 'Failed to withdraw.', type: 'error' });
    }
  };

  const filterJobs = (jobList) => {
    if (!search) return jobList;
    return jobList.filter(job => 
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.companyName.toLowerCase().includes(search.toLowerCase()) ||
      job.location.toLowerCase().includes(search.toLowerCase()) ||
      job.skillsRequired.toLowerCase().includes(search.toLowerCase())
    );
  };

  const currentList = filterJobs(activeTab === 'eligible' ? eligibleJobs : jobs);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Toggle tabs */}
        <div className="grid grid-cols-2 gap-2 bg-slate-900 border border-slate-800 p-1 rounded-xl max-w-sm w-full">
          <button
            onClick={() => setActiveTab('eligible')}
            className={`py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'eligible'
                ? 'bg-primary-600 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Eligible Positions ({eligibleJobs.length})
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'all'
                ? 'bg-primary-600 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All Open Postings ({jobs.length})
          </button>
        </div>

        {/* Search Input */}
        <div className="relative max-w-md w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
            <Search className="h-5 w-5" />
          </div>
          <input
            type="text"
            placeholder="Search by job title, company, skills, or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="block w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-primary-500 text-sm transition-all"
          />
        </div>
      </div>

      {message.text && (
        <div className={`p-4 rounded-xl border flex items-center gap-3 text-xs font-semibold ${
          message.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-red-500/10 border-red-500/30 text-red-400'
        }`}>
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{message.text}</span>
        </div>
      )}

      {/* Verification Warning for Job Board */}
      {!studentVerified && (
        <div className="bg-amber-500/10 border border-amber-500/30 text-amber-400 p-4 rounded-2xl text-xs flex gap-2">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>You can browse listings, but applying requires account verification by the Placement Officer.</span>
        </div>
      )}

      {/* Listings Grid */}
      {currentList.length === 0 ? (
        <div className="glass-panel text-center py-20 rounded-2xl text-slate-500 text-sm font-semibold">
          No matching job vacancies found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {currentList.map((job) => {
            const hasApplied = appliedJobIds.has(job.id);
            return (
              <div key={job.id} className="glass-card p-6 rounded-2xl flex flex-col justify-between gap-5 relative overflow-hidden">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-slate-100 text-base">{job.title}</h3>
                      <p className="text-xs text-primary-400 font-semibold mt-1">{job.companyName}</p>
                    </div>
                    {hasApplied && (
                      <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                        APPLIED
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">{job.description}</p>
                  
                  {/* Skill Badges */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {job.skillsRequired.split(',').map((skill, idx) => (
                      <span key={idx} className="bg-slate-950 text-slate-400 text-[9px] font-semibold px-2 py-0.5 rounded border border-slate-800">
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Details Footer */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-800 text-[11px] text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <DollarSign className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                      <span className="font-semibold text-slate-300">{job.packageAmount} LPA</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Award className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                      <span>Min {job.minCgpa} CGPA</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                      <span>Apply by {new Date(job.deadline).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* CTA Buttons */}
                  <div className="pt-1">
                    {hasApplied ? (
                      <button
                        onClick={() => handleWithdraw(job.id)}
                        className="w-full text-center bg-red-950/20 hover:bg-red-950/40 border border-red-500/30 hover:border-red-500/50 text-red-400 font-semibold py-2 rounded-xl text-xs transition-colors"
                      >
                        Withdraw Application
                      </button>
                    ) : (
                      <button
                        onClick={() => handleApply(job.id)}
                        disabled={!studentVerified}
                        className="w-full text-center bg-primary-600 hover:bg-primary-500 disabled:bg-slate-800 text-white disabled:text-slate-500 font-semibold py-2 rounded-xl text-xs transition-all shadow-lg shadow-primary-500/20 disabled:shadow-none glow-btn"
                      >
                        {!studentVerified ? 'Requires Verification' : 'Submit Application'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default StudentJobs;
