import React, { useState, useEffect } from 'react';
import { matchingApi } from '../services/matchingService';
import { Sparkles, CheckCircle2, User, Send, Check, AlertCircle } from 'lucide-react';

export default function MatchingDashboard({ vacancyId = 1 }) {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hiringWorkerId, setHiringWorkerId] = useState(null);
  const [hiredWorkers, setHiredWorkers] = useState({});
  const [statusMsg, setStatusMsg] = useState(null);

  const fetchMatches = async () => {
    setLoading(true);
    setStatusMsg(null);
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

  const handleRequestHire = async (item) => {
    const customNote = prompt(
      `Send Hire Request to ${item.workerName} for role '${item.vacancyTitle}':\n\nEnter message or contact details (optional):`,
      `We reviewed your ${item.matchScore}% profile match and would like to hire you for '${item.vacancyTitle}'!`
    );

    if (customNote === null) return; // User clicked Cancel

    setHiringWorkerId(item.workerId);
    setStatusMsg(null);

    try {
      await matchingApi.sendHireRequest({
        recipientWorkerId: item.workerId,
        workerName: item.workerName,
        vacancyTitle: item.vacancyTitle,
        employerName: 'Corporate HR',
        message: customNote.trim() || `We reviewed your ${item.matchScore}% profile match and would like to hire you!`,
      });

      setHiredWorkers((prev) => ({ ...prev, [item.workerId]: true }));
      setStatusMsg({
        type: 'success',
        text: `Hire request dispatched to ${item.workerName}! Saved in notifications database.`,
      });
    } catch (error) {
      console.error('Error requesting hire:', error);
      setStatusMsg({
        type: 'error',
        text: 'Failed to dispatch hire request. Ensure matching-service is running on port 8083.',
      });
    } finally {
      setHiringWorkerId(null);
    }
  };

  return (
    <div style={{ padding: '24px', maxWidth: '850px', margin: '20px auto', background: '#fff', borderRadius: '14px', boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: 0, fontSize: '1.35rem', color: '#1e293b' }}>
            <Sparkles color="#f59e0b" size={22} /> Matched Specialists
          </h2>
          <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Vacancy #{vacancyId} Candidate Recommendations</span>
        </div>
        <button
          onClick={fetchMatches}
          style={{ padding: '8px 16px', background: '#0284c7', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '500', fontSize: '0.875rem' }}
        >
          Refresh Matches
        </button>
      </div>

      {statusMsg && (
        <div style={{
          marginBottom: '16px',
          padding: '12px 16px',
          borderRadius: '8px',
          fontSize: '0.875rem',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: statusMsg.type === 'success' ? '#dcfce7' : '#fee2e2',
          color: statusMsg.type === 'success' ? '#166534' : '#991b1b',
          border: `1px solid ${statusMsg.type === 'success' ? '#bbf7d0' : '#fecaca'}`,
        }}>
          {statusMsg.type === 'success' ? <Check size={18} /> : <AlertCircle size={18} />}
          <span>{statusMsg.text}</span>
        </div>
      )}

      {loading ? (
        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Finding best matches...</p>
      ) : matches.length === 0 ? (
        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>No matching workers found for Vacancy #{vacancyId}.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {matches.map((item) => (
            <div key={item.id} style={{ border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px', background: '#f8fafc' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.1rem', color: '#0f172a' }}>
                  <User size={18} color="#475569" /> {item.workerName}
                </h3>
                <span style={{ background: '#dcfce7', color: '#15803d', padding: '4px 10px', borderRadius: '16px', fontWeight: '600', fontSize: '0.85rem' }}>
                  {item.matchScore}% Match
                </span>
              </div>

              <p style={{ margin: '8px 0 4px', color: '#334155', fontSize: '0.92rem' }}>
                <strong>Matched Role:</strong> {item.vacancyTitle}
              </p>
              <p style={{ margin: 0, fontSize: '0.88rem', color: '#64748b' }}>
                <strong>Criteria Met:</strong> {item.matchReason}
              </p>

              <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '0.85rem', color: '#0369a1', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle2 size={16} /> Auto-match alert logged
                </div>

                {hiredWorkers[item.workerId] ? (
                  <span style={{
                    background: '#dcfce7',
                    color: '#15803d',
                    padding: '6px 14px',
                    borderRadius: '6px',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <Check size={15} /> Hire Request Sent
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleRequestHire(item)}
                    disabled={hiringWorkerId === item.workerId}
                    style={{
                      padding: '7px 16px',
                      background: '#ea580c',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '6px',
                      fontWeight: '600',
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                    }}
                  >
                    <Send size={14} />
                    {hiringWorkerId === item.workerId ? 'Sending...' : 'Request Hire'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
