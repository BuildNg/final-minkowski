// /src/components/spacetime_plot.jsx
import React, { useRef } from 'react';
import {
  Stage, Layer, Line, Circle, Text,
} from 'react-konva';
import useStore from '../store';

function SpacetimePlot() {
  const { worldlines, addPoint, currentWorldline } = useStore();
  const stageRef = useRef(null);

  // Canvas dimensions
  const width = window.innerWidth - 250; // Subtract control panel width
  const height = window.innerHeight;

  // Coordinate scaling factors
  const xScale = width / 20; // Assuming x ranges from -10 to 10
  const yScale = height / 20; // Assuming t ranges from -10 to 10

  // Convert data coordinates to canvas coordinates
  const dataToCanvasX = (x) => (x + 10) * xScale;
  const dataToCanvasY = (t) => height - (t + 10) * yScale;

  // Handle click events
  const handleClick = (event) => {
    const stage = stageRef.current;
    const pointerPosition = stage.getPointerPosition();
    const { x } = pointerPosition;
    const { y } = pointerPosition;

    // Convert canvas coordinates back to data coordinates
    const xData = x / xScale - 10;
    const yData = (height - y) / yScale - 10;

    addPoint(currentWorldline, xData, yData);
  };

  // Draw axes, grid lines, and labels
  const drawAxes = () => {
    const lines = [];

    // X and Y axes
    lines.push(
      <Line
        key="x-axis"
        points={[0, height / 2, width, height / 2]}
        stroke="black"
        strokeWidth={1}
      />,
      <Line
        key="y-axis"
        points={[width / 2, 0, width / 2, height]}
        stroke="black"
        strokeWidth={1}
      />,
    );

    // Grid lines and labels
    for (let i = -10; i <= 10; i += 1) {
      const x = dataToCanvasX(i);
      const y = dataToCanvasY(i);

      // Vertical grid lines
      lines.push(
        <Line
          key={`v-grid-${i}`}
          points={[x, 0, x, height]}
          stroke="#ddd"
          strokeWidth={0.5}
        />,
      );

      // Horizontal grid lines
      lines.push(
        <Line
          key={`h-grid-${i}`}
          points={[0, y, width, y]}
          stroke="#ddd"
          strokeWidth={0.5}
        />,
      );

      // X-axis labels
      lines.push(
        <Text
          key={`x-label-${i}`}
          x={x - 5}
          y={height / 2 + 5}
          text={`${i}`}
          fontSize={10}
        />,
      );

      // Y-axis labels
      lines.push(
        <Text
          key={`y-label-${i}`}
          x={width / 2 + 5}
          y={y - 5}
          text={`${i}`}
          fontSize={10}
        />,
      );
    }

    return lines;
  };

  // Draw worldlines
  const drawWorldlines = () => {
    const elements = [];

    Object.keys(worldlines).forEach((key) => {
      const worldline = worldlines[key];
      const points = [];

      for (let i = 0; i < worldline.times.length; i += 1) {
        const x = dataToCanvasX(worldline.positions[i]);
        const y = dataToCanvasY(worldline.times[i]);
        points.push(x, y);

        // Draw points
        elements.push(
          <Circle
            key={`point-${key}-${i}`}
            x={x}
            y={y}
            radius={3}
            fill={`rgb(${key * 50}, ${key * 50}, 150)`}
          />,
        );
      }

      // Draw lines
      if (points.length >= 4) {
        elements.push(
          <Line
            key={`line-${key}`}
            points={points}
            stroke={`rgb(${key * 50}, ${key * 50}, 150)`}
            strokeWidth={2}
          />,
        );
      }
    });

    return elements;
  };

  return (
    <div className="plot-container">
      <Stage
        width={width}
        height={height}
        onMouseDown={handleClick}
        ref={stageRef}
      >
        <Layer>
          {drawAxes()}
          {drawWorldlines()}
        </Layer>
      </Stage>
    </div>
  );
}

export default SpacetimePlot;
