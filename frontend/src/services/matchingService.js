const MATCHING_API_BASE = 'http://localhost:8083/api/matches';

export const matchingApi = {
  getMatchesForVacancy: async (vacancyId) => {
    const response = await fetch(`${MATCHING_API_BASE}/vacancy/${vacancyId}`);
    if (!response.ok) throw new Error('Failed to fetch matches');
    return response.json();
  }
};