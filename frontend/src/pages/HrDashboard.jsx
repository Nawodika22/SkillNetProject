import React, { useState, useEffect } from 'react';
import { getAllVacancies, createVacancy, deleteVacancy } from '../services/vacancyService';

const HrDashboard = () => {
  const [vacancies, setVacancies] = useState([]);
  const [formData, setFormData] = useState({
    companyId: 1,
    jobTitle: '',
    requiredSkills: '',
    minExperience: '',
    targetLocation: '',
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetchVacancies();
  }, []);

  const fetchVacancies = async () => {
    try {
      const data = await getAllVacancies();
      setVacancies(data);
    } catch (error) {
      console.error('Error fetching vacancies:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createVacancy({
        ...formData,
        minExperience: parseInt(formData.minExperience),
      });
      setMsg('Vacancy posted successfully!');
      setFormData({
        companyId: 1,
        jobTitle: '',
        requiredSkills: '',
        minExperience: '',
        targetLocation: '',
      });
      fetchVacancies();
    } catch (error) {
      console.error('Error posting vacancy:', error);
      setMsg('Failed to post vacancy.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this vacancy?')) {
      try {
        await deleteVacancy(id);
        fetchVacancies();
      } catch (error) {
        console.error('Error deleting vacancy:', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="border-b pb-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">SkillNet Corporate HR Portal</h1>
            <p className="text-sm text-slate-500">Post job vacancies and review system-generated matches</p>
          </div>
          <span className="bg-indigo-100 text-indigo-700 text-xs px-3 py-1.5 rounded-full font-semibold">
            Company ID: #{formData.companyId}
          </span>
        </header>

        {msg && (
          <div className="p-3 bg-emerald-100 border border-emerald-300 text-emerald-800 rounded-lg text-sm">
            {msg}
          </div>
        )}

        {/* Vacancy Creation Form */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Post a New Vacancy</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Job Title</label>
              <input
                type="text"
                name="jobTitle"
                required
                value={formData.jobTitle}
                onChange={handleChange}
                placeholder="e.g. Electrician, Carpenter"
                className="w-full p-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Target Location</label>
              <input
                type="text"
                name="targetLocation"
                required
                value={formData.targetLocation}
                onChange={handleChange}
                placeholder="e.g. Colombo, Kandy"
                className="w-full p-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Minimum Experience (Years)</label>
              <input
                type="number"
                name="minExperience"
                required
                min="0"
                value={formData.minExperience}
                onChange={handleChange}
                placeholder="e.g. 2"
                className="w-full p-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Required Skills (Comma separated)</label>
              <input
                type="text"
                name="requiredSkills"
                required
                value={formData.requiredSkills}
                onChange={handleChange}
                placeholder="e.g. Wiring, Circuit Repair"
                className="w-full p-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div className="md:col-span-2 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg shadow transition"
              >
                {loading ? 'Posting...' : 'Create Vacancy'}
              </button>
            </div>
          </form>
        </div>

        {/* Existing Vacancies List */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Current Active Vacancies</h2>
          {vacancies.length === 0 ? (
            <p className="text-sm text-slate-400">No active vacancies found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b bg-slate-50 text-slate-600">
                    <th className="p-3">ID</th>
                    <th className="p-3">Title</th>
                    <th className="p-3">Location</th>
                    <th className="p-3">Min Exp</th>
                    <th className="p-3">Required Skills</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {vacancies.map((v) => (
                    <tr key={v.vacancyId} className="border-b hover:bg-slate-50">
                      <td className="p-3 font-mono text-slate-500">#{v.vacancyId}</td>
                      <td className="p-3 font-semibold text-slate-800">{v.jobTitle}</td>
                      <td className="p-3">{v.targetLocation}</td>
                      <td className="p-3">{v.minExperience} yrs</td>
                      <td className="p-3 text-slate-600">{v.requiredSkills}</td>
                      <td className="p-3 text-right space-x-2">
                        <button
                          onClick={() => alert(`Member 3 matching engine will fetch workers for Vacancy #${v.vacancyId}`)}
                          className="px-3 py-1 text-xs bg-emerald-50 text-emerald-700 border border-emerald-300 rounded hover:bg-emerald-100"
                        >
                          Find Matches
                        </button>
                        <button
                          onClick={() => handleDelete(v.vacancyId)}
                          className="px-3 py-1 text-xs bg-rose-50 text-rose-700 border border-rose-300 rounded hover:bg-rose-100"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HrDashboard;