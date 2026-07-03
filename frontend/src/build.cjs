const fs = require('fs');
let html = fs.readFileSync('C:/Users/nikhil.m/.gemini/antigravity-ide/brain/a720bf86-2564-49e4-9ff7-3ed73a1c3d4b/.system_generated/steps/4/content.md', 'utf8');

// Extract body content
let bodyStart = html.indexOf('<body>') + 6;
let bodyEnd = html.indexOf('<script src="script.js">');
let body = html.substring(bodyStart, bodyEnd);

// Convert to JSX
let jsx = body
  .replace(/class=/g, 'className=')
  .replace(/<img([\s\S]*?)>/g, (match) => {
     if(match.endsWith('/>')) return match;
     return match.replace(/>$/, ' />');
  })
  .replace(/<br([\s\S]*?)>/g, (match) => {
     if(match.endsWith('/>')) return match;
     return match.replace(/>$/, ' />');
  })
  .replace(/<hr([\s\S]*?)>/g, (match) => {
     if(match.endsWith('/>')) return match;
     return match.replace(/>$/, ' />');
  })
  .replace(/<input([\s\S]*?)>/g, (match) => {
     if(match.endsWith('/>')) return match;
     return match.replace(/>$/, ' />');
  })
  .replace(/>>>/g, '&#62;&#62;&#62;')
  .replace(/assets\//g, 'https://kenzo-fitness.vercel.app/assets/')
  .replace(/stroke-width/g, 'strokeWidth')
  .replace(/stroke-linecap/g, 'strokeLinecap')
  .replace(/stroke-linejoin/g, 'strokeLinejoin')
  .replace(/<!--([\s\S]*?)-->/g, '') // remove comments
  .replace(/style="([\s\S]*?)"/g, (match, styleString) => {
    // Basic inline style to object converter
    let styles = styleString.split(';').filter(s => s.trim() !== '').map(s => {
      let [key, val] = s.split(':');
      if(!key || !val) return '';
      let camelKey = key.trim().replace(/-([a-z])/g, g => g[1].toUpperCase());
      return `'${camelKey}': '${val.trim()}'`;
    }).join(', ');
    return `style={{ ${styles} }}`;
  })
  .replace(/&times;/g, 'x'); // Replace HTML entities if necessary

let component = `
import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, LayoutDashboard } from 'lucide-react';
import '../kenzo.css';

const Home = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  useEffect(() => {
    // Dynamically load the kenzo.js script
    const script = document.createElement('script');
    script.src = '/kenzo.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      if(document.body.contains(script)) {
        document.body.removeChild(script);
      }
    }
  }, []);

  return (
    <div className="kenzo-wrapper">
      ${jsx}

      {/* Inject Admin/Dashboard Buttons into header dynamically or use absolute positioning if needed */}
      {user && (
        <div style={{ position: 'fixed', top: '15px', right: '15px', zIndex: 9999, display: 'flex', gap: '10px' }}>
          <button 
            onClick={() => navigate(user.role === 'admin' ? '/admin' : user.role === 'trainer' ? '/trainer' : '/dashboard')}
            style={{ padding: '8px 16px', background: '#c1ff00', color: '#000', borderRadius: '20px', fontWeight: 'bold', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
          >
            <LayoutDashboard size={16} /> Dashboard
          </button>
          <button 
            onClick={handleLogout}
            style={{ padding: '8px 16px', background: '#333', color: '#fff', borderRadius: '20px', fontWeight: 'bold', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;
`;

fs.writeFileSync('c:/Users/nikhil.m/Documents/folder/frontend/src/pages/Home.jsx', component);
console.log('Converted Home.jsx');
