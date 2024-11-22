import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

// Function to calculate proper time (age)
function calculateProperTime(times, positions) {
  let properTime = 0;
  for (let i = 1; i < times.length; i += 1) {
    const dt = times[i] - times[i - 1];
    const dx = positions[i] - positions[i - 1];
    const dsSquared = dt ** 2 - dx ** 2;
    if (dsSquared >= 0) {
      properTime += Math.sqrt(dsSquared);
    }
    // Handle spacelike intervals (ds^2 < 0) if necessary
  }
  return properTime;
}

const useStore = create(
  devtools(
    immer((set) => ({
      worldlines: {
        1: { times: [], positions: [], age: 0 },
        2: { times: [], positions: [], age: 0 },
        3: { times: [], positions: [], age: 0 },
      },
      currentWorldline: 1,
      setCurrentWorldline: (id) => set((state) => {
        state.currentWorldline = id;
      }),
      addPoint: (id, x, t) => set((state) => {
        const worldline = state.worldlines[id];
        worldline.positions.push(x);
        worldline.times.push(t);
        worldline.age = calculateProperTime(worldline.times, worldline.positions);
      }),
      deleteWorldline: (id) => set((state) => {
        state.worldlines[id] = { times: [], positions: [], age: 0 };
      }),
      deleteLastPoint: (id) => set((state) => {
        const worldline = state.worldlines[id];
        if (worldline.positions.length > 0) {
          worldline.positions.pop();
          worldline.times.pop();
          worldline.age = calculateProperTime(worldline.times, worldline.positions);
        }
      }),
    })),
  ),
);

export default useStore;
