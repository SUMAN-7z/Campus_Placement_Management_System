import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Award, ShieldCheck, Briefcase, GraduationCap, ArrowRight, CheckCircle, TrendingUp } from 'lucide-react';

const Home = () => {
  const { user } = useAuth();

  const getDashboardPath = () => {
    if (!user) return '/';
    if (user.role === 'ROLE_STUDENT') return '/student/dashboard';
    if (user.role === 'ROLE_RECRUITER') return '/recruiter/dashboard';
    return '/officer/dashboard';
  };

  return (
    <div className="min-h-screen bg-black text-slate-100">
      {/* Header */}
      <header className="max-w-7xl mx-auto w-full px-6 h-20 flex items-center justify-between border-b border-slate-900">
        <div className="flex items-center space-x-2">
          <Award className="h-8 w-8 text-primary-500" />
          <span className="font-bold text-lg tracking-wider bg-gradient-to-r from-emerald-400 via-cyan-400 to-sky-400 bg-clip-text text-transparent">
            PLACEMENT PORTAL
          </span>
        </div>
        <nav className="flex items-center space-x-6">
          <Link to="/about" className="text-sm text-slate-400 hover:text-slate-200 transition-colors">About</Link>
          {user ? (
            <Link to={getDashboardPath()} className="text-sm bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg transition-all shadow-lg shadow-primary-500/20 font-medium glow-btn">
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link to="/login" className="text-sm bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-200 px-4 py-2 rounded-lg transition-colors font-medium">
                Sign In
              </Link>
              <Link to="/register" className="text-sm bg-primary-600 hover:bg-primary-500 text-white px-4 py-2 rounded-lg transition-all shadow-lg shadow-primary-500/20 font-medium glow-btn">
                Get Started
              </Link>
            </>
          )}
        </nav>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto w-full px-6 py-16 md:py-24 flex-1 flex flex-col md:flex-row items-center justify-between gap-12">
        <div className="flex-1 space-y-6 text-center md:text-left">
          <div className="inline-flex items-center space-x-2 bg-primary-500/10 border border-primary-500/30 text-primary-400 text-xs px-3 py-1 rounded-full font-semibold">
            <CheckCircle className="h-3.5 w-3.5" />
            <span>Production Ready Enterprise Portal</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
            Streamlining Campus <br />
            <span className="bg-gradient-to-r from-primary-400 via-sky-400 to-indigo-400 bg-clip-text text-transparent">
              Placements & Hiring
            </span>
          </h1>
          
          <p className="text-slate-400 text-lg max-w-xl mx-auto md:mx-0">
            A unified digital hub connecting students, placement officers, and corporate recruiters. Track applications, schedule interviews, and visualize analytics in real-time.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-4">
            {user ? (
              <Link to={getDashboardPath()} className="inline-flex items-center justify-center bg-primary-600 hover:bg-primary-500 text-white px-6 py-3.5 rounded-xl font-semibold shadow-lg shadow-primary-500/25 transition-all text-sm glow-btn">
                Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            ) : (
              <>
                <Link to="/register" className="inline-flex items-center justify-center bg-primary-600 hover:bg-primary-500 text-white px-6 py-3.5 rounded-xl font-semibold shadow-lg shadow-primary-500/25 transition-all text-sm glow-btn">
                  Create Account <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <Link to="/login" className="inline-flex items-center justify-center bg-slate-900 border border-slate-800 hover:bg-slate-800 px-6 py-3.5 rounded-xl font-semibold transition-colors text-sm">
                  Dashboard Login
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Hero Features Visual grid */}
        <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto">
          <div className="glass-card p-6 rounded-2xl space-y-3">
            <GraduationCap className="h-10 w-10 text-primary-400" />
            <h3 className="font-bold text-slate-200">For Students</h3>
            <p className="text-xs text-slate-400">Complete academic profiles, upload resumes, track application milestones, and schedule live interview rounds.</p>
          </div>
          <div className="glass-card p-6 rounded-2xl space-y-3">
            <Briefcase className="h-10 w-10 text-indigo-400" />
            <h3 className="font-bold text-slate-200">For Recruiters</h3>
            <p className="text-xs text-slate-400">Register company details, publish jobs with eligibility limits, shortlist student applicants, and update hiring statuses.</p>
          </div>
          <div className="glass-card p-6 rounded-2xl space-y-3">
            <ShieldCheck className="h-10 w-10 text-emerald-400" />
            <h3 className="font-bold text-slate-200">For Officers</h3>
            <p className="text-xs text-slate-400">Verify student academic records, approve corporate HR accounts, post recruitment drives, and publish final statistics.</p>
          </div>
          <div className="glass-card p-6 rounded-2xl space-y-3 bg-gradient-to-br from-primary-950/10 to-indigo-950/20 border-primary-500/20">
            <TrendingUp className="h-10 w-10 text-sky-400" />
            <h3 className="font-bold text-slate-200">Live Analytics</h3>
            <p className="text-xs text-slate-400">Branch-wise statistics, package distribution details, and monthly application metrics visually compiled.</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900/50 border-t border-slate-900 py-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Campus Placement Cell. All rights reserved.</p>
          <div className="flex space-x-4">
            <Link to="/about" className="hover:text-slate-400 transition-colors">Platform Information</Link>
            <span className="text-slate-800">|</span>
            <span className="text-slate-500">MCA Internship</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
