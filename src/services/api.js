const API_BASE = 'https://cp-rating-api.vercel.app';

export async function fetchCodeChef(username) {
  try {
    const res = await fetch(`${API_BASE}/codechef/${username}`);
    if (!res.ok) throw new Error('Network response was not ok');
    const data = await res.json();
    return {
      platform: 'codechef',
      username: data.username || username,
      avatar: data.avatar,
      rating: parseInt(data.rating) || null,
      stars: data.stars,
      globalRank: parseInt(data.globalRank) || null,
      problemsSolved: parseInt(data.problemsSolved) || null,
      color: data.color
    };
  } catch (error) {
    console.error(`Failed to fetch CodeChef for ${username}:`, error);
    return null;
  }
}

export async function fetchCodeforces(username) {
  try {
    const res = await fetch(`${API_BASE}/codeforces/${username}`);
    if (!res.ok) throw new Error('Network response was not ok');
    const data = await res.json();
    return {
      platform: 'codeforces',
      username: data.handle || username,
      avatar: data.titlePhoto,
      rating: parseInt(data.rating) || null,
      maxRating: parseInt(data.maxRating) || null,
      rankTitle: data.rank,
      color: data.color
    };
  } catch (error) {
    console.error(`Failed to fetch Codeforces for ${username}:`, error);
    return null;
  }
}

export async function fetchLeetCode(username) {
  try {
    const res = await fetch(`${API_BASE}/leetcode/${username}`);
    if (!res.ok) throw new Error('Network response was not ok');
    const data = await res.json();
    return {
      platform: 'leetcode',
      username: data.user || username,
      avatar: data.avatar,
      rank: parseInt(data.rank) || null,
      problemsSolved: parseInt(data.problemsSolved) || null,
      totalProblems: parseInt(data.totalProblems) || null
    };
  } catch (error) {
    console.error(`Failed to fetch LeetCode for ${username}:`, error);
    return null;
  }
}

// Fetch all profiles for a given user configuration
export async function fetchAllUserStats(userConfig) {
  const promises = [];
  
  if (userConfig.codechef) promises.push(fetchCodeChef(userConfig.codechef));
  if (userConfig.codeforces) promises.push(fetchCodeforces(userConfig.codeforces));
  if (userConfig.leetcode) promises.push(fetchLeetCode(userConfig.leetcode));
  
  const results = await Promise.all(promises);
  const profiles = results.filter(Boolean);
  
  // Normalize into a single unified record
  return normalizeUserProfiles(userConfig.id, userConfig.displayName, profiles);
}

function normalizeUserProfiles(id, displayName, profiles) {
  const codeforces = profiles.find(p => p.platform === 'codeforces');
  const codechef = profiles.find(p => p.platform === 'codechef');
  const leetcode = profiles.find(p => p.platform === 'leetcode');
  
  // Pick an avatar (preference: Codeforces -> Leetcode -> Codechef -> placeholder)
  const avatar = (codeforces?.avatar || leetcode?.avatar || codechef?.avatar) || 'https://github.com/identicons/default.png';

  // Calculate an abstract "overall score" just for baseline sorting across platforms.
  // We don't pretend they are the same metric, but we need an integer for ordering.
  // 1 CF rating point ~ 1 CC rating point. Leetcode solved * 2 roughly approximates.
  let overallScore = 0;
  if (codeforces?.rating) overallScore = Math.max(overallScore, codeforces.rating);
  if (codechef?.rating) overallScore = Math.max(overallScore, codechef.rating);
  if (leetcode?.problemsSolved) overallScore = Math.max(overallScore, leetcode.problemsSolved * 2);

  return {
    id,
    displayName,
    avatar,
    overallScore,
    platforms: {
      codeforces: codeforces || null,
      codechef: codechef || null,
      leetcode: leetcode || null
    }
  };
}
