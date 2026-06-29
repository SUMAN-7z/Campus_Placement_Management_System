import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { Check, X, ShieldAlert, CheckCircle2, Globe, Building2, Search } from 'lucide-react';

const OfficerCompanies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [updatingId, setUpdatingId] = useState(null);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const res = await API.get('/api/officer/companies');
      setCompanies(res.data);
    } catch (err) {
      console.error('Failed to load companies list', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveToggle = async (id, currentStatus) => {
    setUpdatingId(id);
    setMessage({ text: '', type: '' });
    try {
      await API.put(`/api/officer/companies/${id}/approve?status=${!currentStatus}`);
      
      // Update local state list
      setCompanies(prev => 
        prev.map(c => c.id === id ? { ...c, isApproved: !currentStatus } : c)
      );
      setMessage({ 
        text: `Company approval ${!currentStatus ? 'granted' : 'revoked'} successfully!`, 
        type: 'success' 
      });
    } catch (err) {
      setMessage({ text: err.response?.data?.message || 'Approval update failed.', type: 'error' });
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredCompanies = companies.filter(company =>
    company.companyName.toLowerCase().includes(search.toLowerCase()) ||
    company.email.toLowerCase().includes(search.toLowerCase()) ||
    (company.industry && company.industry.toLowerCase().includes(search.toLowerCase())) ||
    (company.hrName && company.hrName.toLowerCase().includes(search.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-3">
        <h2 className="text-xl font-bold text-slate-200">Corporate HR Approvals</h2>
        
        {/* Search */}
        <div className="relative max-w-xs w-full">
          <input
            type="text"
            placeholder="Search by company name, HR, domain..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="block w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-primary-500"
          />
        </div>
      </div>

      {message.text && (
        <div className={`p-4 rounded-xl border flex items-center gap-3 text-xs font-semibold ${
          message.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-red-500/10 border-red-500/30 text-red-400'
        }`}>
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <span>{message.text}</span>
        </div>
      )}

      {/* Table view */}
      <div className="glass-panel rounded-2xl overflow-hidden border border-slate-800">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left border-collapse">
            <thead>
              <tr className="table-header">
                <th className="px-6 py-4">Company Details</th>
                <th className="px-6 py-4">Industry Domain</th>
                <th className="px-6 py-4">HR Recruiter Details</th>
                <th className="px-6 py-4">Web Link</th>
                <th className="px-6 py-4 text-right">Approval Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850">
              {filteredCompanies.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-500 text-xs font-medium">
                    No corporate accounts registered in the database.
                  </td>
                </tr>
              ) : (
                filteredCompanies.map((c) => (
                  <tr key={c.id} className="table-row text-slate-300">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-200 text-xs flex items-center gap-1.5">
                        <Building2 className="h-4 w-4 text-primary-400 shrink-0" />
                        {c.companyName}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5" title={c.address}>{c.address ? c.address.substring(0, 40) + '...' : 'Address not specified'}</div>
                    </td>
                    <td className="px-6 py-4 text-xs font-semibold">
                      {c.industry || 'General Domain'}
                    </td>
                    <td className="px-6 py-4 text-xs">
                      <div className="font-semibold">{c.hrName || 'HR Name'}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{c.email} • {c.phone}</div>
                    </td>
                    <td className="px-6 py-4">
                      {c.website ? (
                        <a 
                          href={c.website.startsWith('http') ? c.website : `https://${c.website}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[10px] text-primary-400 hover:text-primary-300 font-bold"
                        >
                          <Globe className="h-3.5 w-3.5" /> Visit Site
                        </a>
                      ) : (
                        <span className="text-[10px] text-slate-600 italic">No website specified</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleApproveToggle(c.id, c.isApproved)}
                        disabled={updatingId === c.id}
                        className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                          c.isApproved 
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20' 
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20'
                        }`}
                      >
                        {c.isApproved ? (
                          <>
                            <Check className="h-3.5 w-3.5" /> Approved (Revoke)
                          </>
                        ) : (
                          <>
                            <ShieldAlert className="h-3.5 w-3.5 animate-pulse" /> Approve Company
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default OfficerCompanies;
