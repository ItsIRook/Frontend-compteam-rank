import { useEffect, useState } from 'react';
import { fetchAllUserStats } from './services/api';

const MOCK_USERS = [
  { id: '1', displayName: 'tourist', codeforces: 'tourist', codechef: 'tourist', leetcode: 'tourist' },
  { id: '2', displayName: 'Errichto', codeforces: 'Errichto', codechef: 'errichto', leetcode: 'errichto' },
  { id: '3', displayName: 'WilliamLin', codeforces: 'tmwilliamlin168', codechef: 'tmwilliamlin', leetcode: 'williamlin' },
  { id: '4', displayName: 'NealWu', codeforces: 'neal', codechef: 'neal', leetcode: 'neal_wu' }
];

function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [activeTab, setActiveTab] = useState('overall');

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const results = await Promise.all(MOCK_USERS.map(u => fetchAllUserStats(u)));
        // Sort by overall score by default
        results.sort((a, b) => b.overallScore - a.overallScore);
        setUsers(results);
        setLastUpdated(new Date().toLocaleTimeString());
      } catch (err) {
        console.error("Failed to load leaderboard data", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const getSortedUsers = () => {
    const sorted = [...users];
    if (activeTab === 'codeforces') {
      sorted.sort((a, b) => (b.platforms.codeforces?.rating || 0) - (a.platforms.codeforces?.rating || 0));
    } else if (activeTab === 'codechef') {
      sorted.sort((a, b) => (b.platforms.codechef?.rating || 0) - (a.platforms.codechef?.rating || 0));
    } else if (activeTab === 'leetcode') {
      sorted.sort((a, b) => (b.platforms.leetcode?.problemsSolved || 0) - (a.platforms.leetcode?.problemsSolved || 0));
    } else {
      sorted.sort((a, b) => b.overallScore - a.overallScore);
    }
    return sorted;
  };

  const sortedUsers = getSortedUsers();

  return (
    <div className="app-container">
      <header className="header">
        <div className="header-title">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path fillRule="evenodd" d="M1.75 2.5a.25.25 0 00-.25.25v10.5c0 .138.112.25.25.25h12.5a.25.25 0 00.25-.25V2.75a.25.25 0 00-.25-.25H1.75zM0 2.75C0 1.784.784 1 1.75 1h12.5C15.216 1 16 1.784 16 2.75v10.5A1.75 1.75 0 0114.25 15H1.75A1.75 1.75 0 010 13.25V2.75zM4 6.75A.75.75 0 014.75 6h2a.75.75 0 01.75.75v5.5a.75.75 0 01-.75.75h-2a.75.75 0 01-.75-.75v-5.5zM8 4.75A.75.75 0 018.75 4h2a.75.75 0 01.75.75v7.5a.75.75 0 01-.75.75h-2a.75.75 0 01-.75-.75v-7.5zM12 8.75a.75.75 0 01.75-.75h2a.75.75 0 01.75.75v3.5a.75.75 0 01-.75.75h-2a.75.75 0 01-.75-.75v-3.5z"></path>
          </svg>
          Group Leaderboard
        </div>
        <nav className="nav-links">
          <a href="#" className="active">Leaderboard</a>
          <a href="#">Members</a>
          <a href="#">Settings</a>
        </nav>
      </header>

      <div className="toolbar">
        <button className={`platform-filter ${activeTab === 'overall' ? 'active' : ''}`} onClick={() => setActiveTab('overall')}>Overall</button>
        <button className={`platform-filter ${activeTab === 'codeforces' ? 'active' : ''}`} onClick={() => setActiveTab('codeforces')}>Codeforces</button>
        <button className={`platform-filter ${activeTab === 'codechef' ? 'active' : ''}`} onClick={() => setActiveTab('codechef')}>CodeChef</button>
        <button className={`platform-filter ${activeTab === 'leetcode' ? 'active' : ''}`} onClick={() => setActiveTab('leetcode')}>LeetCode</button>
      </div>

      <table className="leaderboard-table">
        <thead>
          <tr>
            <th width="40" className="num-col">#</th>
            <th>Member</th>
            <th width="150" className="num-col">Codeforces Rating</th>
            <th width="150" className="num-col">CodeChef Rating</th>
            <th width="150" className="num-col">LeetCode Solved</th>
            <th width="120" className="num-col">Overall Score</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="6" className="loading-state">Syncing API data...</td>
            </tr>
          ) : (
            sortedUsers.map((user, index) => (
              <tr key={user.id} className={`${index < 3 ? 'is-top-3 top-' + (index + 1) : ''}`}>
                <td className="num-col metric-muted">{index + 1}</td>
                <td>
                  <div className="user-cell">
                    <img src={user.avatar} className="avatar" alt={user.displayName} />
                    <span className="username">{user.displayName}</span>
                  </div>
                </td>
                <td className="num-col">
                  {user.platforms.codeforces ? (
                    <div>
                      <span className="metric-cf" style={{ color: user.platforms.codeforces.color || 'var(--color-codeforces)' }}>
                        {user.platforms.codeforces.rating || 'Unrated'}
                      </span>
                      <span className="rank-movement rank-same">•</span>
                    </div>
                  ) : <span className="metric-muted">-</span>}
                </td>
                <td className="num-col">
                  {user.platforms.codechef ? (
                    <div>
                      <span className="metric-cc">{user.platforms.codechef.rating || 'Unrated'}</span>
                      {user.platforms.codechef.stars && <span className="metric-muted" style={{marginLeft: '6px'}}>{user.platforms.codechef.stars}</span>}
                    </div>
                  ) : <span className="metric-muted">-</span>}
                </td>
                <td className="num-col">
                  {user.platforms.leetcode ? (
                    <div>
                      <span className="metric-lc">{user.platforms.leetcode.problemsSolved || 0}</span>
                      <span className="metric-muted"> / {user.platforms.leetcode.totalProblems || '?'}</span>
                    </div>
                  ) : <span className="metric-muted">-</span>}
                </td>
                <td className="num-col metric-neutral">{user.overallScore}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {!loading && lastUpdated && (
        <div className="last-updated">
          Last updated: {lastUpdated}
        </div>
      )}
    </div>
  );
}

export default App;
