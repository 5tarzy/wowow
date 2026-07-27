import React, { useState, useEffect } from 'react';
import { WorldState, Club, MatchResult } from './types';
import { getInitialWorldState } from './data';
import { loadWorld, saveWorld } from './storage';
import { simulateMatch } from './engine/SimulationEngine';
import { advanceDay } from './engine/GlobalScheduler';
import { scoutYouthAcademy } from './engine/YouthAcademy';

export default function App() {
  const [world, setWorld] = useState<WorldState | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'squad' | 'match' | 'academy' | 'history'>('overview');
  const [lastMatch, setLastMatch] = useState<MatchResult | null>(null);
  const [academyMessage, setAcademyMessage] = useState<string>('');

  useEffect(() => {
    async function init() {
      const saved = await loadWorld();
      if (saved) {
        setWorld(saved);
      } else {
        const initial = getInitialWorldState();
        await saveWorld(initial);
        setWorld(initial);
      }
    }
    init();
  }, []);

  if (!world) {
    return <div style={{ color: 'white', padding: '40px', textAlign: 'center', backgroundColor: '#090d16', minHeight: '100vh', fontFamily: 'sans-serif' }}>Loading World Football Simulator...</div>;
  }

  const userClub: Club = world.clubs[0];
  const opponentClub: Club = world.clubs[1];

  const handleSimulateMatch = async () => {
    const result = simulateMatch(userClub, opponentClub, 'Premier League', world.currentDate);
    setLastMatch(result);

    const updatedClubs = world.clubs.map((c, idx) => idx === 0 ? userClub : c);
    const updatedWorld: WorldState = {
      ...world,
      matchHistory: [result, ...world.matchHistory],
      clubs: updatedClubs
    };

    setWorld(updatedWorld);
    await saveWorld(updatedWorld);
  };

  const handleScoutYouth = async () => {
    const { updatedClub, message } = scoutYouthAcademy(userClub, world.currentDate);
    setAcademyMessage(message);

    const updatedClubs = world.clubs.map((c, idx) => idx === 0 ? updatedClub : c);
    const updatedWorld: WorldState = {
      ...world,
      clubs: updatedClubs
    };

    setWorld(updatedWorld);
    await saveWorld(updatedWorld);
  };

  const handleAdvanceDay = async () => {
    const newWorld = advanceDay(world);
    setWorld(newWorld);
    await saveWorld(newWorld);
  };

  return (
    <div style={{ backgroundColor: '#090d16', color: '#f8fafc', minHeight: '100vh', fontFamily: 'sans-serif', display: 'flex', flexDirection: 'column' }}>
      
      {/* TOP HEADER BAR (FM Style) */}
      <header style={{ backgroundColor: '#111827', borderBottom: '1px solid #1f2937', padding: '12px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <h2 style={{ margin: 0, color: '#38bdf8', fontSize: '18px', fontWeight: 'bold' }}>⚽ World Football Simulator</h2>
          <span style={{ backgroundColor: '#1f2937', color: '#94a3b8', padding: '4px 10px', borderRadius: '4px', fontSize: '12px' }}>2026/27 Season</span>
          <span style={{ color: '#cbd5e1', fontSize: '14px' }}>📅 {world.currentDate}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#f8fafc' }}>Managing: {userClub.name}</div>
            <div style={{ fontSize: '11px', color: '#10b981' }}>Finances: Secure</div>
          </div>
          <button 
            onClick={handleAdvanceDay}
            style={{ padding: '10px 20px', backgroundColor: '#10b981', color: '#090d16', fontWeight: 'bold', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.2)' }}>
            Continue ❯
          </button>
        </div>
      </header>

      {/* MAIN CONTAINER WITH SIDEBAR */}
      <div style={{ display: 'flex', flex: 1 }}>
        
        {/* SIDEBAR NAVIGATION */}
        <aside style={{ width: '240px', backgroundColor: '#0d131f', borderRight: '1px solid #1f2937', padding: '20px 10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#64748b', paddingLeft: '10px', marginBottom: '5px', fontWeight: 'bold' }}>Club</div>
          
          <button 
            onClick={() => setActiveTab('overview')}
            style={{ width: '100%', textAlign: 'left', padding: '10px 14px', backgroundColor: activeTab === 'overview' ? '#1e293b' : 'transparent', color: activeTab === 'overview' ? '#38bdf8' : '#94a3b8', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: activeTab === 'overview' ? 'bold' : 'normal' }}>
            📊 Dashboard
          </button>
          <button 
            onClick={() => setActiveTab('squad')}
            style={{ width: '100%', textAlign: 'left', padding: '10px 14px', backgroundColor: activeTab === 'squad' ? '#1e293b' : 'transparent', color: activeTab === 'squad' ? '#38bdf8' : '#94a3b8', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: activeTab === 'squad' ? 'bold' : 'normal' }}>
            👥 Squad Roster ({userClub.players.length})
          </button>
          <button 
            onClick={() => setActiveTab('match')}
            style={{ width: '100%', textAlign: 'left', padding: '10px 14px', backgroundColor: activeTab === 'match' ? '#1e293b' : 'transparent', color: activeTab === 'match' ? '#38bdf8' : '#94a3b8', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: activeTab === 'match' ? 'bold' : 'normal' }}>
            🏟️ Match Day
          </button>
          <button 
            onClick={() => setActiveTab('academy')}
            style={{ width: '100%', textAlign: 'left', padding: '10px 14px', backgroundColor: activeTab === 'academy' ? '#1e293b' : 'transparent', color: activeTab === 'academy' ? '#38bdf8' : '#94a3b8', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: activeTab === 'academy' ? 'bold' : 'normal' }}>
            🌟 Youth Academy
          </button>

          <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#64748b', paddingLeft: '10px', marginTop: '20px', marginBottom: '5px', fontWeight: 'bold' }}>World</div>
          <button 
            onClick={() => setActiveTab('history')}
            style={{ width: '100%', textAlign: 'left', padding: '10px 14px', backgroundColor: activeTab === 'history' ? '#1e293b' : 'transparent', color: activeTab === 'history' ? '#38bdf8' : '#94a3b8', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: activeTab === 'history' ? 'bold' : 'normal' }}>
            📜 Match History ({world.matchHistory.length})
          </button>
        </aside>

        {/* CONTENT AREA */}
        <main style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
          
          {/* TAB 1: OVERVIEW DASHBOARD */}
          {activeTab === 'overview' && (
            <div>
              {/* Club Header Card */}
              <div style={{ backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '10px', padding: '20px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h1 style={{ margin: '0 0 5px 0', fontSize: '24px', color: '#f8fafc' }}>{userClub.name}</h1>
                  <p style={{ margin: 0, color: '#94a3b8', fontSize: '13px' }}>Premier League • Reputation: <strong>{userClub.reputation}/100</strong></p>
                </div>
                <div style={{ display: 'flex', gap: '20px', textAlign: 'right' }}>
                  <div>
                    <div style={{ fontSize: '11px', color: '#94a3b8' }}>Transfer Budget</div>
                    <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#10b981' }}>${(userClub.transferBudget || 50000000).toLocaleString()}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: '#94a3b8' }}>Wage Budget</div>
                    <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#38bdf8' }}>${(userClub.wageBudget || 1000000).toLocaleString()} / wk</div>
                  </div>
                </div>
              </div>

              {/* Grid Widgets */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
                
                {/* Upcoming Fixture Widget */}
                <div style={{ backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '10px', padding: '20px' }}>
                  <h3 style={{ margin: '0 0 15px 0', fontSize: '15px', color: '#38bdf8', borderBottom: '1px solid #1f2937', paddingBottom: '10px' }}>Upcoming Fixture</h3>
                  <div style={{ textAlign: 'center', padding: '15px 0' }}>
                    <p style={{ color: '#94a3b8', fontSize: '12px', margin: '0 0 10px 0' }}>Premier League • Home</p>
                    <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
                      <strong>{userClub.name}</strong>
                      <span style={{ color: '#64748b', fontSize: '14px' }}>VS</span>
                      <strong>{opponentClub.name}</strong>
                    </div>
                  </div>
                  <button 
                    onClick={() => setActiveTab('match')}
                    style={{ width: '100%', padding: '10px', backgroundColor: '#1e293b', color: '#38bdf8', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', marginTop: '10px' }}>
                    Go to Match Day 🏟️
                  </button>
                </div>

                {/* Squad Overview Widget */}
                <div style={{ backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '10px', padding: '20px' }}>
                  <h3 style={{ margin: '0 0 15px 0', fontSize: '15px', color: '#38bdf8', borderBottom: '1px solid #1f2937', paddingBottom: '10px' }}>Squad Summary</h3>
                  <p style={{ margin: '5px 0' }}>Total Players: <strong>{userClub.players.length}</strong></p>
                  <p style={{ margin: '5px 0' }}>Average Squad OVR: <strong>{Math.round(userClub.players.reduce((acc, p) => acc + p.overall, 0) / (userClub.players.length || 1))}</strong></p>
                  <button 
                    onClick={() => setActiveTab('squad')}
                    style={{ width: '100%', padding: '10px', backgroundColor: '#1e293b', color: '#38bdf8', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', marginTop: '15px' }}>
                    View Full Squad Roster 👥
                  </button>
                </div>

                {/* Youth Academy Widget */}
                <div style={{ backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '10px', padding: '20px' }}>
                  <h3 style={{ margin: '0 0 15px 0', fontSize: '15px', color: '#38bdf8', borderBottom: '1px solid #1f2937', paddingBottom: '10px' }}>Youth Academy</h3>
                  <p style={{ margin: '5px 0', color: '#94a3b8', fontSize: '13px' }}>Scout raw talent worldwide with 30-day anti-spam cooldowns.</p>
                  <p style={{ margin: '10px 0 5px 0', fontSize: '12px' }}><strong>Last Scouted:</strong> {userClub.lastYouthScoutDate || 'Never'}</p>
                  <button 
                    onClick={() => setActiveTab('academy')}
                    style={{ width: '100%', padding: '10px', backgroundColor: '#1e293b', color: '#38bdf8', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', marginTop: '10px' }}>
                    Open Academy Hub 🌟
                  </button>
                </div>

              </div>
            </div>
          )}

          {/* TAB 2: SQUAD ROSTER */}
          {activeTab === 'squad' && (
            <div>
              <h2>Squad ({userClub.players.length} Players)</h2>
              <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', backgroundColor: '#111827', borderRadius: '8px', overflow: 'hidden', border: '1px solid #1f2937' }}>
                <thead>
                  <tr style={{ backgroundColor: '#1f2937', color: '#38bdf8' }}>
                    <th style={{ padding: '12px' }}>Name</th>
                    <th>Pos</th>
                    <th>Age</th>
                    <th>OVR</th>
                    <th>POT</th>
                    <th>Value</th>
                    <th>Form</th>
                    <th>Fitness</th>
                  </tr>
                </thead>
                <tbody>
                  {userClub.players.map((p) => (
                    <tr key={p.id} style={{ borderBottom: '1px solid #1f2937' }}>
                      <td style={{ padding: '12px', fontWeight: 'bold' }}>{p.name}</td>
                      <td><span style={{ backgroundColor: '#0284c7', padding: '2px 6px', borderRadius: '4px', fontSize: '11px', color: 'white' }}>{p.position}</span></td>
                      <td>{p.age}</td>
                      <td><strong style={{ color: '#10b981' }}>{p.overall}</strong></td>
                      <td>{p.potential}</td>
                      <td>${(p.value / 1000000).toFixed(1)}M</td>
                      <td>{p.form}%</td>
                      <td>{p.fitness ?? 100}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 3: MATCH DAY */}
          {activeTab === 'match' && (
            <div style={{ backgroundColor: '#111827', border: '1px solid #1f2937', padding: '30px', borderRadius: '10px', textAlign: 'center', maxWidth: '700px', margin: '0 auto' }}>
              <h2>Match Day Arena</h2>
              <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', margin: '30px 0', backgroundColor: '#0d131f', padding: '20px', borderRadius: '8px' }}>
                <div>
                  <h3 style={{ margin: 0, color: '#38bdf8' }}>{userClub.name}</h3>
                  <p style={{ margin: '5px 0 0 0', color: '#94a3b8', fontSize: '12px' }}>Home</p>
                </div>
                <h1 style={{ margin: 0, color: '#64748b' }}>VS</h1>
                <div>
                  <h3 style={{ margin: 0, color: '#f8fafc' }}>{opponentClub.name}</h3>
                  <p style={{ margin: '5px 0 0 0', color: '#94a3b8', fontSize: '12px' }}>Away</p>
                </div>
              </div>

              <button 
                onClick={handleSimulateMatch}
                style={{ padding: '15px 35px', fontSize: '16px', backgroundColor: '#10b981', color: '#090d16', fontWeight: 'bold', border: 'none', borderRadius: '8px', cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.2)' }}>
                Simulate Match ⚡
              </button>

              {lastMatch && (
                <div style={{ marginTop: '30px', borderTop: '1px solid #1f2937', paddingTop: '20px', textAlign: 'left' }}>
                  <h3 style={{ color: '#10b981', textAlign: 'center', fontSize: '20px', margin: '0 0 15px 0' }}>Result: {lastMatch.homeScore} - {lastMatch.awayScore}</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', backgroundColor: '#0d131f', padding: '15px', borderRadius: '8px' }}>
                    <div>
                      <h4 style={{ margin: '0 0 10px 0', color: '#38bdf8' }}>{userClub.name}</h4>
                      <p style={{ margin: '4px 0', fontSize: '13px' }}>Shots: {lastMatch.homeStats.shots} ({lastMatch.homeStats.shotsOnTarget} on target)</p>
                      <p style={{ margin: '4px 0', fontSize: '13px' }}>xG: {lastMatch.homeStats.xG}</p>
                      <p style={{ margin: '4px 0', fontSize: '13px' }}>Possession: {lastMatch.homeStats.possession}%</p>
                    </div>
                    <div>
                      <h4 style={{ margin: '0 0 10px 0', color: '#f8fafc' }}>{opponentClub.name}</h4>
                      <p style={{ margin: '4px 0', fontSize: '13px' }}>Shots: {lastMatch.awayStats.shots} ({lastMatch.awayStats.shotsOnTarget} on target)</p>
                      <p style={{ margin: '4px 0', fontSize: '13px' }}>xG: {lastMatch.awayStats.xG}</p>
                      <p style={{ margin: '4px 0', fontSize: '13px' }}>Possession: {lastMatch.awayStats.possession}%</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: YOUTH ACADEMY */}
          {activeTab === 'academy' && (
            <div style={{ backgroundColor: '#111827', border: '1px solid #1f2937', padding: '24px', borderRadius: '10px', maxWidth: '600px' }}>
              <h2>Youth Academy Scouting Hub</h2>
              <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: '1.5' }}>Send scouts out to discover global youth prospects. Protected by a strict 30-day cooldown system to prevent button spamming.</p>
              <div style={{ backgroundColor: '#0d131f', padding: '12px 16px', borderRadius: '6px', margin: '15px 0', border: '1px solid #1f2937' }}>
                <span style={{ color: '#94a3b8', fontSize: '13px' }}>Last Scouted Date: </span>
                <strong style={{ color: '#f8fafc' }}>{userClub.lastYouthScoutDate || 'Never'}</strong>
              </div>

              <button 
                onClick={handleScoutYouth}
                style={{ padding: '12px 24px', backgroundColor: '#0284c7', color: 'white', fontWeight: 'bold', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                Scout Youth Prospect 🔍
              </button>

              {academyMessage && (
                <div style={{ marginTop: '20px', padding: '12px 16px', backgroundColor: '#0d131f', borderRadius: '6px', color: '#38bdf8', border: '1px solid #1f2937', fontSize: '13px' }}>
                  {academyMessage}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: HISTORY */}
          {activeTab === 'history' && (
            <div>
              <h2>Match History</h2>
              {world.matchHistory.length === 0 ? <p style={{ color: '#94a3b8' }}>No matches played yet.</p> : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {world.matchHistory.map((m) => (
                    <div key={m.id} style={{ backgroundColor: '#111827', border: '1px solid #1f2937', padding: '14px 20px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: '#94a3b8', fontSize: '13px' }}>{m.date}</span>
                      <strong style={{ fontSize: '15px' }}>{userClub.name} {m.homeScore} - {m.awayScore} {opponentClub.name}</strong>
                      <span style={{ fontSize: '12px', color: '#64748b' }}>xG: {m.homeStats.xG} - {m.awayStats.xG}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
