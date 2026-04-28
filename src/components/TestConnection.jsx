import { useEffect, useState } from 'react';
import { supabaseScraper } from '../lib/supabase';

export default function TestConnection() {
  const [status, setStatus] = useState('Testing...');
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const testConnection = async () => {
      try {
        console.log('Testing Supabase scraper connection...');
        console.log('URL:', import.meta.env.VITE_SUPABASE_SCRAPER_URL);
        
        const { data: result, error: err } = await supabaseScraper
          .from('f1_data')
          .select('data')
          .order('inserted_at', { ascending: false })
          .limit(1);
        
        if (err) {
          console.error('Error:', err);
          setError(err.message);
          setStatus('Failed');
        } else {
          console.log('Success! Data:', result);
          setStatus('Connected!');
          setData(result);
        }
      } catch (e) {
        console.error('Exception:', e);
        setError(e.message);
        setStatus('Failed');
      }
    };
    
    testConnection();
  }, []);

  return (
    <div style={{ 
      background: '#1a1d24', 
      color: 'white', 
      padding: '15px', 
      margin: '10px',
      borderRadius: '8px',
      border: '1px solid #E8002D',
      position: 'relative',
      zIndex: 999,
      fontSize: '14px'
    }}>
      <h3 style={{ margin: '0 0 10px 0', color: '#E8002D' }}>Supabase Connection Test</h3>
      <p style={{ margin: '5px 0' }}><strong>Status:</strong> {status}</p>
      {error && <p style={{ margin: '5px 0', color: '#ff6b6b' }}><strong>Error:</strong> {error}</p>}
      {data && (
        <details>
          <summary style={{ cursor: 'pointer', margin: '5px 0' }}>Data received (click to expand)</summary>
          <pre style={{ fontSize: '10px', overflow: 'auto', maxHeight: '200px', background: '#0a0c10', padding: '8px', borderRadius: '4px' }}>
            {JSON.stringify(data, null, 2)}
          </pre>
        </details>
      )}
    </div>
  );
}
