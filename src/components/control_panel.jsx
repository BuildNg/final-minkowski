// /src/components/control_panel.jsx

import React, { useState } from 'react';
import useStore from '../store';

function ControlPanel() {
  const {
    currentWorldline,
    setCurrentWorldline,
    deleteWorldline,
    deleteLastPoint,
    addPoint,
    worldlines,
  } = useStore();

  // Local state to manage input fields for each worldline
  const [inputs, setInputs] = useState({
    1: { x: '', t: '' },
    2: { x: '', t: '' },
    3: { x: '', t: '' },
  });

  const handleWorldlineSelect = (id) => {
    setCurrentWorldline(id);
  };

  const handleDelete = (id) => {
    deleteWorldline(id);
  };

  const handleDeleteLastPoint = (id) => {
    deleteLastPoint(id);
  };

  const handleInputChange = (id, field, value) => {
    setInputs((prevInputs) => ({
      ...prevInputs,
      [id]: { ...prevInputs[id], [field]: value },
    }));
  };

  const handleAddPoint = (id) => {
    const xValue = parseFloat(inputs[id].x);
    const tValue = parseFloat(inputs[id].t);

    if (!Number.isNaN(xValue) && !Number.isNaN(tValue)) {
      const success = addPoint(id, xValue, tValue);
      if (success) {
        setInputs((prevInputs) => ({
          ...prevInputs,
          [id]: { x: '', t: '' },
        }));
      } else {
        alert('Cannot add point: This would result in motion faster than the speed of light.');
      }
    } else {
      alert('Please enter valid numerical values for x and t.');
    }
  };

  return (
    <div className="control-panel">
      <h3>Worldline Controls</h3>
      {[1, 2, 3].map((id) => (
        <div key={id} className="worldline-control">
          <button
            type="button"
            onClick={() => handleWorldlineSelect(id)}
            style={{
              backgroundColor: currentWorldline === id ? '#ddd' : '#fff',
            }}
          >
            Select Worldline {id}
          </button>
          <button type="button" onClick={() => handleDelete(id)}>Delete Worldline {id}</button>
          <button type="button" onClick={() => handleDeleteLastPoint(id)}>Delete Last Point</button>
          <div>
            Age {id}: {worldlines[id].age.toFixed(2)}
          </div>
          <div>
            Points:
            <div style={{ maxHeight: '100px', overflowY: 'auto', marginTop: '5px' }}>
              {worldlines[id].points.map((point) => (
                <div key={point.id}>
                  ({point.x.toFixed(2)}, {point.t.toFixed(2)})
                </div>
              ))}
            </div>
          </div>
          <div>
            <input
              type="text"
              placeholder="x"
              value={inputs[id].x}
              onChange={(e) => handleInputChange(id, 'x', e.target.value)}
              style={{ width: '50px', marginRight: '5px' }}
            />
            <input
              type="text"
              placeholder="t"
              value={inputs[id].t}
              onChange={(e) => handleInputChange(id, 't', e.target.value)}
              style={{ width: '50px', marginRight: '5px' }}
            />
            <button type="button" onClick={() => handleAddPoint(id)}>Add Point</button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ControlPanel;
