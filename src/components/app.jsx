import React from 'react';
import SpacetimePlot from './spacetime_plot';
import ControlPanel from './control_panel';
import './app.css';

function App() {
  return (
    <div className="app">
      <SpacetimePlot />
      <ControlPanel />
    </div>
  );
}

export default App;
