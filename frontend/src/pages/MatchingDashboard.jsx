import React, { useState, useEffect } from 'react';
import { matchingApi } from '../services/matchingService';
import { Sparkles, CheckCircle2, User } from 'lucide-react';

export default function MatchingDashboard({ vacancyId = 1 }) {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchMatches = async () => {
    setLoading(true);
    try {
      const data = await matchingApi.getMatchesForVacancy(vacancyId);
      setMatches(data);
    } catch (err) {
      console.error('Error fetching matches:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, [vacancyId]);

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '20px auto', background: '#fff', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: 0, fontSize: '1.4rem' }}>
          <Sparkles color="#f59e0b" size={24} /> Matched Specialists
        </h2>
        <button 
          onClick={fetchMatches}
          style={{ padding: '8px 16px', background: '#0284c7', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
        >
          Refresh Matches
        </button>
      </div>

      {loading ? (
        <p>Finding best matches...</p>
      ) : matches.length === 0 ? (
        <p style={{ color: '#666' }}>No matching workers found for Vacancy #{vacancyId}.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {matches.map((item) => (
            <div key={item.id} style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px', background: '#f8fafc' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '6px', fontSize: '1.1rem' }}>
                  <User size={18} /> {item.workerName}
                </h3>
                <span style={{ background: '#dcfce7', color: '#15803d', padding: '4px 10px', borderRadius: '16px', fontWeight: 'bold', fontSize: '0.85rem' }}>
                  {item.matchScore}% Match
                </span>
              </div>

              <p style={{ margin: '8px 0 4px', color: '#334155' }}>
                <strong>Role:</strong> {item.vacancyTitle}
              </p>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#64748b' }}>
                <strong>Criteria Met:</strong> {item.matchReason}
              </p>

              <div style={{ marginTop: '12px', fontSize: '0.85rem', color: '#0369a1', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={16} /> Notification dispatched to worker
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}