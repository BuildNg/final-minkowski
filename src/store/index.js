// /src/store/index.jsx

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { v4 as uuidv4 } from 'uuid';

// Function to calculate proper time between two points
function calculateProperTime(point1, point2) {
  const dt = point2.t - point1.t;
  const dx = point2.x - point1.x;
  const dsSquared = dt ** 2 - dx ** 2;
  if (dsSquared >= 0) {
    return [Math.sqrt(dsSquared), true];
  } else {
    // Spacelike interval detected
    return [0, false];
  }
}

const useStore = create(
  devtools(
    immer((set, get) => ({
      worldlines: {
        1: { points: [], ages: [], age: 0 },
        2: { points: [], ages: [], age: 0 },
        3: { points: [], ages: [], age: 0 },
      },
      currentWorldline: 1,
      setCurrentWorldline: (id) => set((state) => {
        state.currentWorldline = id;
      }),
      addPoint: (id, x, t) => {
        const state = get();
        const worldline = state.worldlines[id];
        const newPoint = { id: uuidv4(), x, t };

        if (worldline.points.length > 0) {
          const lastPoint = worldline.points[worldline.points.length - 1];
          const [properTime, isValid] = calculateProperTime(lastPoint, newPoint);

          if (!isValid) {
            // Do not add the point
            return false;
          } else {
            // Proceed to add the point
            set((draft) => {
              const worldlineDraft = draft.worldlines[id];
              worldlineDraft.points.push(newPoint);
              worldlineDraft.ages.push(properTime);
              worldlineDraft.age += properTime;
            });
            return true;
          }
        } else {
          // First point, no need to calculate proper time
          set((draft) => {
            const worldlineDraft = draft.worldlines[id];
            worldlineDraft.points.push(newPoint);
          });
          return true;
        }
      },
      deleteWorldline: (id) => set((state) => {
        state.worldlines[id] = { points: [], ages: [], age: 0 };
      }),
      deleteLastPoint: (id) => set((state) => {
        const worldline = state.worldlines[id];
        const pointsLength = worldline.points.length;
        if (pointsLength > 0) {
          // If there is more than one point, adjust the age
          if (pointsLength > 1) {
            const lastAge = worldline.ages.pop();
            worldline.age -= lastAge;
          }
          // Remove the last point
          worldline.points.pop();
        }
      }),
    })),
  ),
);

export default useStore;
