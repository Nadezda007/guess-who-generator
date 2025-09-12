import React, { useMemo } from "react";
import seedrandom from "seedrandom";

import { alpha } from "@mui/system";

import patternShapes from "../../data/patternShapes";
import {
    generateTrianglePoints,
    generateDiamondPoints,
    generateStarPath,
    generateHeartPath,
    generateCrossPath,
    generateZigzagPath,
    generateQuestionMarkPath,
    generateInfinityPath,
    generateSpiralPath,
} from "../../utils/shapeGenerators";

const PatternedBackground = React.memo(({
    width,
    height,
    seed = "default-seed",
    color = "rgba(0, 0, 0, 1)",
    shapesCount = 100,
    shapeTypes = patternShapes,
    minSize = 10,
    maxSize = 50,
    minOpacity = 0.2,
    maxOpacity = 0.6,
    minRotate = 0,
    maxRotate = 360,
    deadZone = 1.2,
    maxAttemptsPerShape = 10,
    globalFailLimit = 100,
}) => {
    const placedShapes = [];
    let globalFails = 0;

    const checkCollision = (x, y, size) => {
        if (deadZone <= 0) return false;

        for (const shape of placedShapes) {
            const dx = shape.x - x;
            const dy = shape.y - y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const minDistance = ((shape.size + size) / 2) * deadZone;
            if (dist < minDistance) {
                return true;
            }
        }
        return false;
    };

    const rng = seedrandom(seed);
    const generatedShapes = [];

    for (let i = 0; i < shapesCount; i++) {
        let attempts = 0;
        let placed = false;

        while (attempts < maxAttemptsPerShape && !placed) {
            const x = rng() * width;
            const y = rng() * height;
            const size = minSize + rng() * (maxSize - minSize);

            if (!checkCollision(x, y, size)) {
                const shape = shapeTypes[Math.floor(rng() * shapeTypes.length)];
                const rotate = minRotate + rng() * (maxRotate - minRotate);
                const opacity = minOpacity + rng() * (maxOpacity - minOpacity);
                const finalColor = alpha(color, Math.min(Math.max(+opacity.toFixed(2), 0), 1));

                placedShapes.push({ x, y, size });

                generatedShapes.push({ key: i, shape, size, x, y, rotate, finalColor });
                placed = true;
            } else {
                attempts++;
                globalFails++;
            }

        }

        if (globalFails > globalFailLimit) break;
    }

    const generateTrianglePointsMemo = useMemo(() => generateTrianglePoints(), []);
    const generateDiamondPointsMemo = useMemo(() => generateDiamondPoints(), []);
    const generateStarPathMemo = useMemo(() => generateStarPath(), []);
    const generateHexagramPathMemo = useMemo(() => generateStarPath({ spikes: 6, innerRadius: 1 / 3.464 }), []); //2*sqrt(3)
    const generateHeartPathMemo = useMemo(() => generateHeartPath(), []);
    const generateCrossPathMemo = useMemo(() => generateCrossPath(), []);
    const generateQuestionMarkPathMemo = useMemo(() => generateQuestionMarkPath(), []);
    const generateZigzagPathMemo = useMemo(() => generateZigzagPath(), []);
    const generateInfinityPathMemo = useMemo(() => generateInfinityPath(), []);
    const generateSpiralPathMemo = useMemo(() => generateSpiralPath(), []);

    return (
        <svg width={width} height={height} style={{
            position: "absolute", top: 0, left: 0, pointerEvents: "none"
        }}>
            {generatedShapes.map(({ key, shape, size, x, y, rotate, finalColor }) => {
                const transform = `translate(${x}, ${y}) rotate(${rotate}) scale(${size})`;

                // const debugCircle = (
                //     <circle
                //         key={`${key}-debug`}
                //         cx={0}
                //         cy={0}
                //         r={0.5}
                //         fill="none"
                //         stroke="red"
                //         strokeWidth={0.05}
                //         transform={transform}
                //     />
                // );

                const renderShape = () => {
                    switch (shape) {
                        case "circle":
                            return <circle cx={0} cy={0} r={0.5} fill={finalColor} transform={transform} />;
                        case "square":
                            return <rect x={-0.5} y={-0.5} width={1} height={1} fill={finalColor} transform={transform} />;
                        case "triangle":
                            return <polygon points={generateTrianglePointsMemo} fill={finalColor} transform={transform} />;
                        case "diamond":
                            return <polygon points={generateDiamondPointsMemo} fill={finalColor} transform={transform} />;
                        case "star":
                            return <path d={generateStarPathMemo} fill={finalColor} transform={transform} />;
                        case "hexagram":
                            return <path d={generateHexagramPathMemo} fill={finalColor} transform={transform} />;
                        case "heart":
                            return <path d={generateHeartPathMemo} fill={finalColor} transform={transform} />;
                        case "cross":
                            return <path d={generateCrossPathMemo} fill={finalColor} transform={transform} />;
                        case "question":
                            return <path d={generateQuestionMarkPathMemo} fill={finalColor} transform={transform} />;
                        case "zigzag":
                            return <path d={generateZigzagPathMemo} fill="none" stroke={finalColor} strokeWidth={0.1} transform={transform} />;
                        case "infinity":
                            return <path d={generateInfinityPathMemo} fill="none" stroke={finalColor} strokeWidth={0.1} transform={transform} />;
                        case "spiral":
                            return <path d={generateSpiralPathMemo} fill="none" stroke={finalColor} strokeWidth={0.07} transform={transform} />;
                        default:
                            return null;
                    }
                };

                return (
                    <g key={key}>
                        {/* {debugCircle} */}
                        {renderShape()}
                    </g>
                );
            })}

        </svg>
    );
});


export default PatternedBackground;
