import { useState, useEffect } from 'react';

// Global state
export let nextRace = null;
export const driversData = new Map();
export const constructorsPoints = new Map();
export const driverPhotos = new Map();

// Function to retrieve the latest scraper data using direct fetch
export const retrieveScraperData = async () => {
  try {
    const url = import.meta.env.VITE_SUPABASE_SCRAPER_URL;
    // Use service key first (for Netlify), fall back to anon key (for local)
    const apiKey = import.meta.env.VITE_SUPABASE_SCRAPER_SERVICE_KEY || import.meta.env.VITE_SUPABASE_SCRAPER_ANON_KEY;
    
    console.log('Fetching from:', `${url}/rest/v1/f1_data?select=data&order=inserted_at.desc&limit=1`);
    console.log('Using key type:', import.meta.env.VITE_SUPABASE_SCRAPER_SERVICE_KEY ? 'SERVICE_ROLE' : 'ANON');
    
    const response = await fetch(
      `${url}/rest/v1/f1_data?select=data&order=inserted_at.desc&limit=1`,
      {
        method: 'GET',
        headers: {
          'apikey': apiKey,
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    );
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Response error:', response.status, errorText);
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }
    
    const result = await response.json();
    console.log('Fetch result:', result);
    
    if (result && result[0] && result[0].data) {
      return result[0].data;
    }
    return null;
  } catch (error) {
    console.error('Error retrieving scraper data:', error);
    return null;
  }
};

// Function to load and parse the latest data
export const loadLatestData = async () => {
  const latestData = await retrieveScraperData();
  
  if (latestData) {
    nextRace = latestData.next_race;
    
    const driversList = latestData.drivers_championship;
    driversData.clear();
    for (const entry of driversList) {
      driversData.set(entry.driver, {
        points: entry.points,
        team: entry.team,
      });
    }
    
    const constructorsList = latestData.constructors_championship;
    constructorsPoints.clear();
    for (const entry of constructorsList) {
      constructorsPoints.set(entry.team, entry.points);
    }
    
    const photosMap = latestData.driver_photos;
    driverPhotos.clear();
    for (const [key, value] of Object.entries(photosMap)) {
      driverPhotos.set(key, String(value));
    }
    
    console.log('Data loaded successfully:', {
      nextRace,
      driversCount: driversData.size,
      constructorsCount: constructorsPoints.size,
      photosCount: driverPhotos.size
    });
    
    return true;
  }
  
  return false;
};

// Helper function to get team colors
const getTeamColor = (teamName) => {
  const teamColors = {
    'Mercedes': '#00D2BE',
    'Ferrari': '#E8002D',
    'McLaren': '#FF8000',
    'Red Bull Racing': '#3671C6',
    'Haas F1 Team': '#B6BABD',
    'Alpine': '#FF87BC',
    'Racing Bulls': '#5E8FAA',
    'Audi': '#0B5E2E',
    'Williams': '#64C4FF',
    'Cadillac': '#FFB800',
    'Aston Martin': '#2D826F'
  };
  return teamColors[teamName] || '#FFFFFF';
};

// Get driver standings as an array
export const getDriverStandingsArray = () => {
  const standings = [];
  for (const [driver, data] of driversData.entries()) {
    standings.push({
      name: driver,
      points: data.points,
      team: data.team,
    });
  }
  standings.sort((a, b) => b.points - a.points);
  return standings.map((standing, index) => ({
    ...standing,
    position: index + 1,
    color: getTeamColor(standing.team),
  }));
};

// Get constructor standings as an array
export const getConstructorStandingsArray = () => {
  const standings = [];
  for (const [team, points] of constructorsPoints.entries()) {
    standings.push({
      name: team,
      points: points,
    });
  }
  standings.sort((a, b) => b.points - a.points);
  return standings.map((standing, index) => ({
    ...standing,
    position: index + 1,
    color: getTeamColor(standing.name),
  }));
};

// Get next race info
export const getNextRaceInfo = () => {
  const raceCoordinates = {
    'Miami Grand Prix': { lat: 25.9581, lng: -80.2389, circuit: 'Miami International Autodrome', location: 'Miami, Florida', date: 'May 4, 2025', time: '15:00 CET' },
    'Spanish Grand Prix': { lat: 41.57, lng: 2.26, circuit: 'Circuit de Barcelona-Catalunya', location: 'Barcelona, Spain', date: 'June 1, 2025', time: '15:00 CET' },
  };
  
  const coords = raceCoordinates[nextRace] || raceCoordinates['Miami Grand Prix'];
  
  return {
    name: nextRace || 'Miami Grand Prix',
    circuit: coords.circuit,
    location: coords.location,
    date: coords.date,
    time: coords.time,
    lat: coords.lat,
    lng: coords.lng,
  };
};

// React Hook
export const useScraperData = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [drivers, setDrivers] = useState([]);
  const [constructors, setConstructors] = useState([]);
  const [raceInfo, setRaceInfo] = useState(null);
  
  useEffect(() => {
    const initData = async () => {
      try {
        setLoading(true);
        const success = await loadLatestData();
        setDataLoaded(success);
        
        if (success) {
          setDrivers(getDriverStandingsArray());
          setConstructors(getConstructorStandingsArray());
          setRaceInfo(getNextRaceInfo());
        } else {
          setError('Failed to load scraper data');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    initData();
  }, []);
  
  const reloadData = async () => {
    setLoading(true);
    const success = await loadLatestData();
    if (success) {
      setDrivers(getDriverStandingsArray());
      setConstructors(getConstructorStandingsArray());
      setRaceInfo(getNextRaceInfo());
      setDataLoaded(true);
      setError(null);
    } else {
      setError('Failed to reload data');
    }
    setLoading(false);
    return success;
  };
  
  return {
    loading,
    error,
    dataLoaded,
    drivers,
    constructors,
    nextRace: raceInfo,
    driversDataMap: driversData,
    constructorsPointsMap: constructorsPoints,
    driverPhotosMap: driverPhotos,
    reloadData
  };
};
