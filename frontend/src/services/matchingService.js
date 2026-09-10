const MATCHING_API_BASE = '/api/matches';
const NOTIFICATION_API_BASE = '/api/notifications';

export const matchingApi = {
  getMatchesForVacancy: async (vacancyId) => {
    const response = await fetch(`${MATCHING_API_BASE}/vacancy/${vacancyId}`);
    if (!response.ok) throw new Error('Failed to fetch matches');
    return response.json();
  },

  sendNotification: async (notificationData) => {
    const response = await fetch(NOTIFICATION_API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(notificationData),
    });
    if (!response.ok) throw new Error('Failed to dispatch notification');
    return response.json();
  },

  sendHireRequest: async (hireData) => {
    const response = await fetch(`${NOTIFICATION_API_BASE}/hire`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(hireData),
    });
    if (!response.ok) throw new Error('Failed to send hire request');
    return response.json();
  },

  getWorkerNotifications: async (workerId) => {
    const response = await fetch(`${NOTIFICATION_API_BASE}/worker/${workerId}`);
    if (!response.ok) throw new Error('Failed to fetch notifications');
    return response.json();
  },
};