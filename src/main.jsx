import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

// index.html にある <div id="root"></div> を探す
const root = createRoot(document.getElementById('root'));
root.render(<App />);
