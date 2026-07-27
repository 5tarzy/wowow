import React, { useState, useEffect } from 'react';
import { WorldState, Club, MatchResult } from './types';
import { getInitialWorldState } from './data';
import { loadWorld, saveWorld } from './storage';
import { simulateMatch } from './engine/SimulationEngine';
import { advanceDay } from './engine/GlobalScheduler';
import { scoutYouthAcademy } from './engine/YouthAcademy';

export default function App() {
  const [world, setWorld] = useState<WorldState | null>(null);
  const [activeTab, setActiveTab] = useState<'squad' | 'match' | 'history' | 'academy'>('squad');
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
    return <div style={{ color: 'white', padding: '20px' }}>Loading Football GM Universe...</div>;
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

  return (
    <div style={{ backgroundColor: '#0f172a', color: '#f8fafc', minHeight: '100vh', fontFamily: 'sans-serif', padding: '20px' }}>
      <header style={{ borderBottom: '1px solid #334155', paddingBottom: '15px', marginBottom: '20px' }}>
        <h1 style={{ margin: 0, color: '#38bdf8' }}>Football Management Simulator</h1>
        <p style={{ color: '#94a3b8', margin: '5px 0 0 0' }}>Managing: <strong>{userClub.name}</strong> | Date: {world.currentDate}</p>
        
        <button 
          onClick={async () => {
            const newWorld = advanceDay(world);
            setWorld(newWorld);
            await saveWorld(newWorld);
          }}
          style={{ marginTop: '10px', padding: '8px 15px', backgroundColor: '#475569', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Advance 1 Day ⏩
        </button>
      </header>

      {/* Navigation Tabs */}
      <nav style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button 
          onClick={() => setActiveTab('squad')}
          style={{ padding: '10px 20px', backgroundColor: activeTab === 'squad' ? '#0284c7' : '#1e293b', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          Squad Roster
        </button>
        <button 
          onClick={() => setActiveTab('match')}
          style={{ padding: '10px 20px', backgroundColor: activeTab === 'match' ? '#0284c7' : '#1e293b', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          Match Day
        </button>
        <button 
          onClick={() => setActiveTab('academy')}
          style={{ padding: '10px 20px', backgroundColor: activeTab === 'academy' ? '#0284c7' : '#1e293b', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          Youth Academy
        </button>
        <button 
          onClick={() => setActiveTab('history')}
          style={{ padding: '10px 20px', backgroundColor: activeTab === 'history' ? '#0284c7' : '#1e293b', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          Match History ({world.matchHistory.length})
        </button>
      </nav>

      {/* TAB 1: SQUAD ROSTER */}
      {activeTab === 'squad' && (
        <div>
          <h2>Squad ({userClub.players.length} Players)</h2>
          <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', backgroundColor: '#1e293b', borderRadius: '8px', overflow: 'hidden' }}>
            <thead>
              <tr style={{ backgroundColor: '#334155', color: '#38bdf8' }}>
                <th style={{ padding: '12px' }}>Name</th>
                <th>Pos</th>
                <th>Age</th>
                <th>OVR</th>
                <th>POT</th>
                <th>Value</th>
                <th>Form</th>
              </tr>
            </thead>
            <tbody>
              {userClub.players.map((p) => (
                <tr key={p.id} style={{ borderBottom: '1px solid #334155' }}>
                  <td style={{ padding: '12px' }}>{p.name}</td>
                  <td><span style={{ backgroundColor: '#0284c7', padding: '2px 6px', borderRadius: '4px', fontSize: '12px' }}>{p.position}</span></td>
                  <td>{p.age}</td>
                  <td><strong>{p.overall}</strong></td>
                  <td>{p.potential}</td>
                  <td>${(p.value / 1000000).toFixed(1)}M</td>
                  <td>{p.form}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 2: MATCH DAY */}
      {activeTab === 'match' && (
        <div style={{ backgroundColor: '#1e293b', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
          <h2>Upcoming Fixture</h2>
          <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', margin: '30px 0' }}>
            <div>
              <h3>{userClub.name}</h3>
              <p>Home</p>
            </div>
            <h2>VS</h2>
            <div>
              <h3>{opponentClub.name}</h3>
              <p>Away</p>
            </div>
          </div>

          <button 
            onClick={handleSimulateMatch}
            style={{ padding: '15px 30px', fontSize: '18px', backgroundColor: '#22c55e', color: 'white', fontWeight: 'bold', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
            Simulate Match
          </button>

          {lastMatch && (
            <div style={{ marginTop: '30px', borderTop: '1px solid #334155', paddingTop: '20px' }}>
              <h2 style={{ color: '#22c55e' }}>Result: {lastMatch.homeScore} - {lastMatch.awayScore}</h2>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', marginTop: '15px' }}>
                <div>
                  <p>Shots: {lastMatch.homeStats.shots} ({lastMatch.homeStats.shotsOnTarget} on target)</p>
                  <p>xG: {lastMatch.homeStats.xG}</p>
                  <p>Possession: {lastMatch.homeStats.possession}%</p>
                </div>
                <div>
                  <p>Shots: {lastMatch.awayStats.shots} ({lastMatch.awayStats.shotsOnTarget} on target)</p>
                  <p>xG: {lastMatch.awayStats.xG}</p>
                  <p>Possession: {lastMatch.awayStats.possession}%</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: YOUTH ACADEMY */}
      {activeTab === 'academy' && (
        <div style={{ backgroundColor: '#1e293b', padding: '20px', borderRadius: '8px' }}>
          <h2>Youth Academy Scouting</h2>
          <p style={{ color: '#94a3b8' }}>Send scouts out to discover youth prospects. Scouts can only return with a new prospect once every 30 days.</p>
          <p><strong>Last Scouted Date:</strong> {userClub.lastYouthScoutDate || 'Never'}</p>

          <button 
            onClick={handleScoutYouth}
            style={{ padding: '12px 25px', backgroundColor: '#0284c7', color: 'white', fontWeight: 'bold', border: 'none', borderRadius: '6px', cursor: 'pointer', marginTop: '10px' }}>
            Scout Youth Prospect 🔍
          </button>

          {academyMessage && (
            <p style={{ marginTop: '15px', padding: '10px', backgroundColor: '#334155', borderRadius: '5px', color: '#38bdf8' }}>
              {academyMessage}
            </p>
          )}
        </div>
      )}

      {/* TAB 4: HISTORY */}
      {activeTab === 'history' && (
        <div>
          <h2>Match History</h2>
          {world.matchHistory.length === 0 ? <p>No matches played yet.</p> : (
            <ul>
              {world.matchHistory.map((m) => (
                <li key={m.id} style={{ marginBottom: '10px', backgroundColor: '#1e293b', padding: '10px', borderRadius: '5px' }}>
                  {m.date} - <strong>{userClub.name} {m.homeScore} - {m.awayScore} {opponentClub.name}</strong> (xG: {m.homeStats.xG} vs {m.awayStats.xG})
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
