import { Task, Volunteer } from '@/backend/data/mock-data';

export interface MatchResult {
  volunteer: Volunteer;
  score: number;
  breakdown: {
    skillMatch: number;
    proximity: number;
    availability: number;
    rating: number;
    experience: number;
  };
  reasoning: string;
}

function haversineDistance(
  lat1: number, lng1: number,
  lat2: number, lng2: number
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function computeSkillMatch(required: string[], has: string[]): number {
  if (required.length === 0) return 1;
  const normalizedRequired = required.map(s => s.toLowerCase());
  const normalizedHas = has.map(s => s.toLowerCase());
  let matchCount = 0;
  for (const req of normalizedRequired) {
    if (normalizedHas.some(h => h.includes(req) || req.includes(h))) {
      matchCount++;
    }
  }
  return matchCount / normalizedRequired.length;
}

function computeProximityScore(distance: number): number {
  if (distance <= 1) return 1;
  if (distance <= 5) return 0.9 - (distance - 1) * 0.05;
  if (distance <= 20) return 0.7 - (distance - 5) * 0.02;
  if (distance <= 50) return 0.4 - (distance - 20) * 0.01;
  return Math.max(0.05, 0.1 - (distance - 50) * 0.001);
}

export function matchVolunteers(
  task: Task,
  volunteers: Volunteer[],
  topN: number = 3
): MatchResult[] {
  const results: MatchResult[] = [];

  for (const vol of volunteers) {
    if (vol.availability === 'offline') continue;

    const distance = haversineDistance(
      task.location.lat, task.location.lng,
      vol.location.lat, vol.location.lng
    );

    const skillMatch = computeSkillMatch(task.requiredSkills, vol.skills);
    const proximity = computeProximityScore(distance);
    const availability = vol.availability === 'available' ? 1 : 0.3;
    const rating = vol.rating / 5;
    const experience = Math.min(vol.completedTasks / 100, 1);

    const score =
      skillMatch * 0.35 +
      proximity * 0.25 +
      availability * 0.20 +
      rating * 0.15 +
      experience * 0.05;

    const matchedSkills = vol.skills.filter(s =>
      task.requiredSkills.some(
        r => r.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(r.toLowerCase())
      )
    );

    const reasoning = `Matches prioritized based on real-time proximity (${distance.toFixed(1)} km), ${matchedSkills.length > 0 ? `verified ${matchedSkills.join(', ')} expertise` : 'general availability'}, and ${vol.availability === 'available' ? 'immediate availability' : 'limited availability'}.`;

    results.push({
      volunteer: vol,
      score: Math.round(score * 100),
      breakdown: {
        skillMatch: Math.round(skillMatch * 100),
        proximity: Math.round(proximity * 100),
        availability: Math.round(availability * 100),
        rating: Math.round(rating * 100),
        experience: Math.round(experience * 100),
      },
      reasoning,
    });
  }

  results.sort((a, b) => b.score - a.score);
  return results.slice(0, topN);
}

export function computePriority(
  severity: number,
  peopleAffected: number,
  urgency: number
): number {
  const normalizedPeople = Math.min(peopleAffected / 500, 1) * 10;
  return severity * 0.5 + normalizedPeople * 0.3 + urgency * 0.2;
}
