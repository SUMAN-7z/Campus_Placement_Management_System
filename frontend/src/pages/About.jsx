import React from 'react';
import { Link } from 'react-router-dom';
import { Award, Code2, Database, ShieldAlert, Cpu } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      {/* Header */}
      <header className="max-w-7xl mx-auto w-full px-6 h-20 flex items-center justify-between border-b border-slate-900">
        <div className="flex items-center space-x-2">
          <Award className="h-8 w-8 text-primary-500" />
          <Link to="/" className="font-bold text-lg tracking-wider bg-gradient-to-r from-primary-400 to-indigo-400 bg-clip-text text-transparent">
            PLACEMENT PORTAL
          </Link>
        </div>
        <Link to="/login" className="text-sm bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-200 px-4 py-2 rounded-lg transition-colors font-medium">
          Sign In
        </Link>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto w-full px-6 py-16 flex-1 space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-extrabold tracking-tight">
            About the Placement Management System
          </h1>
          <p className="text-slate-400 text-base max-w-2xl mx-auto">
            This platform is an enterprise-grade solution designed to replace manual tracking in university campus placement cells, ensuring clean workflows and data validation.
          </p>
        </div>

        {/* Tech Stack Cards */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-200 border-b border-slate-800 pb-2">Technical Architecture</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card p-6 rounded-xl space-y-3">
              <Code2 className="h-8 w-8 text-primary-400" />
              <h3 className="font-semibold text-slate-200">Frontend Web</h3>
              <p className="text-xs text-slate-400">
                Built with React 19, Vite, React Router DOM for SPA routing, Tailwind CSS for interface styling, and Recharts for analytical graphics.
              </p>
            </div>
            <div className="glass-card p-6 rounded-xl space-y-3">
              <Cpu className="h-8 w-8 text-indigo-400" />
              <h3 className="font-semibold text-slate-200">Backend Rest API</h3>
              <p className="text-xs text-slate-400">
                Driven by Java 21, Spring Boot 3.3, JPA / Hibernate, and secured using custom JWT authentication filters and role checks.
              </p>
            </div>
            <div className="glass-card p-6 rounded-xl space-y-3">
              <Database className="h-8 w-8 text-emerald-400" />
              <h3 className="font-semibold text-slate-200">Relational DB</h3>
              <p className="text-xs text-slate-400">
                Backed by MySQL 8 database storing audit trails, notifications, and application state metrics with relational constraints and indexes.
              </p>
            </div>
          </div>
        </section>

        {/* Feature List */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-200 border-b border-slate-800 pb-2">Core Capabilities</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-start space-x-3">
              <ShieldAlert className="h-5 w-5 text-primary-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-slate-200 text-sm">Role Based Access Controls</h4>
                <p className="text-xs text-slate-400">Strictly segregated dashboards and routers for Admins, Placement Officers, Recruiters, and Students.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <ShieldAlert className="h-5 w-5 text-primary-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-slate-200 text-sm">Job Eligibility Validation</h4>
                <p className="text-xs text-slate-400">Automatic code evaluation checking student verification status, current CGPA thresholds, and target batch years.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <ShieldAlert className="h-5 w-5 text-primary-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-slate-200 text-sm">Resume File Handling</h4>
                <p className="text-xs text-slate-400">File uploads with automatic folder generation and relative path serving for file accessibility.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <ShieldAlert className="h-5 w-5 text-primary-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-slate-200 text-sm">Live System Alerts</h4>
                <p className="text-xs text-slate-400">Real-time alerts triggered on interview schedulings, job creations, and application status transitions.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Project Info */}
        <section className="p-6 rounded-xl bg-slate-900 border border-slate-800 text-center space-y-4">
          <h3 className="font-bold text-slate-200">Academic Project Context</h3>
          <p className="text-xs text-slate-400 max-w-xl mx-auto">
            This project has been developed to focusing on enterprise design patterns, secure REST configurations, and clean modular codebases.
          </p>
          <div className="pt-2">
            <Link to="/" className="text-primary-400 hover:text-primary-300 font-semibold text-xs transition-colors">
              ← Return to Home
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900/50 border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        <p>© {new Date().getFullYear()} Campus Placement Cell. BPUT Portfolio Edition.</p>
      </footer>
    </div>
  );
};

export default About;
