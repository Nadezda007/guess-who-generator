export const generateTrianglePoints = (size = 1) => {
    const height = (Math.sqrt(3) / 2) * size;
    return [
        [0, -height / 2],
        [-size / 2, height / 2],
        [size / 2, height / 2],
    ]
        .map(([x, y]) => `${x},${y - (size * 0.1)}`)
        .join(" ");
};

export const generateDiamondPoints = (size = 1) => {
    return [
        [0, -size / 2],
        [size / 3, 0],
        [0, size / 2],
        [-size / 3, 0],
    ]
        .map(([x, y]) => `${x},${y}`)
        .join(" ");
};

export const generateStarPath = ({ size = 1, spikes = 5, outerRadius = null, innerRadius = null } = {}) => {
    const oRadius = outerRadius ?? (size / 2);
    const iRadius = innerRadius ?? (size / 4);
    const step = Math.PI / spikes;
    let path = "";
    let rotation = -Math.PI / 2;

    for (let i = 0; i < spikes * 2; i++) {
        const radius = i % 2 === 0 ? oRadius : iRadius;
        const x = Math.cos(rotation) * radius;
        const y = Math.sin(rotation) * radius;
        path += `${i === 0 ? "M" : "L"}${x},${y} `;
        rotation += step;
    }

    path += "Z";
    return path;
};

export const generateHeartPath = (size = 1) => {
    const s = size / 32;

    const topY = -8 * s;
    const leftCurveX1 = -12 * s, leftCurveY1 = -18 * s;
    const leftCurveX2 = -24 * s, leftCurveY2 = 2 * s;
    const bottomX = 0, bottomY = 14 * s;

    const rightCurveX1 = 24 * s, rightCurveY1 = 2 * s;
    const rightCurveX2 = 12 * s, rightCurveY2 = -18 * s;

    return `
        M${bottomX},${topY}
        C${leftCurveX1},${leftCurveY1} ${leftCurveX2},${leftCurveY2} 
        ${bottomX},${bottomY}
        C${rightCurveX1},${rightCurveY1} ${rightCurveX2},${rightCurveY2}
        ${bottomX},${topY}
        Z
    `;
};

export const generateCrossPath = (size = 1, barWidthRatio = 1 / 4) => {
    const s = size * barWidthRatio;
    const half = size / 2;
    const halfS = s / 2;
    return `
        M${-halfS},${-half} 
        H${halfS} V${-halfS} H${half} V${halfS} H${halfS} V${half} 
        H${-halfS} V${halfS} H${-half} V${-halfS} H${-halfS} 
        Z
    `;
};

export const generateZigzagPath = (size = 1, segments = 5) => {
    const stepX = size / segments;
    const stepY = size / 6;
    const shiftX = -(size / 2 + stepX / 2);

    let path = `M${shiftX},${-stepY / 2}`;

    for (let i = 0; i < segments; i++) {
        const x = stepX * (i + 1) + shiftX;
        const y = i % 2 === 0 ? stepY : -stepY;
        path += `L${x},${y} `;
    }

    path += `L${size + stepX + shiftX},${-stepY / 2}`;
    return path;
};

export const generateQuestionMarkPath = (size = 1) => {
    const s = size / 64;
    const offsetX = -size / 2;
    const offsetY = -size * 0.5;

    const x = (v) => offsetX + v * s;
    const y = (v) => offsetY + v * s;
    const xy = (vx, vy) => `${x(vx)},${y(vy)}`;

    const questionPath = `
        M${xy(30.2, 2.1)}
        C${xy(18.6, 2.8)} ${xy(12.5, 9.4)} ${xy(12, 21.3)}
        H${x(23.7)}
        C${xy(23.8, 17.2)} ${xy(26.2, 14.1)} ${xy(30.4, 13.6)}
        C${xy(34.6, 13.2)} ${xy(38.6, 14.2)} ${xy(39.8, 17)}
        C${xy(41.1, 20.1)} ${xy(38.2, 23.7)} ${xy(36.8, 25.2)}
        C${xy(34.2, 28)} ${xy(30, 30.1)} ${xy(27.8, 33.1)}
        C${xy(25.7, 36.1)} ${xy(25.3, 40)} ${xy(25.1, 44.8)}
        H${x(35.4)}
        C${xy(35.5, 41.7)} ${xy(35.7, 38.8)} ${xy(37.1, 36.9)}
        C${xy(39.4, 33.8)} ${xy(42.8, 32.4)} ${xy(45.6, 29.9)}
        C${xy(48.3, 27.6)} ${xy(51.2, 24.8)} ${xy(51.6, 20.4)}
        C${xy(53.3, 7.5)} ${xy(42.7, 1.3)} ${xy(30.2, 2.1)}
        Z
    `;

    const dot = `
        M${xy((30.5 - 6.5), 55.6)}
        a${6.5 * s},${6.4 * s} 0 1,0 ${13 * s},0
        a${6.5 * s},${6.4 * s} 0 1,0 ${-13 * s},0
    `;

    return `${questionPath} ${dot}`;
};

export const generateInfinityPath = (size = 1) => {
    const loopRadius = size / 6;
    const offset = loopRadius / Math.sqrt(2);
    const gap = offset * 2;
    const centerOffset = offset + gap;

    return `
        M${centerOffset},${offset}
        a${loopRadius},${loopRadius} 0 0,1 ${-gap},0
        L0,0
        l${offset},${-offset}
        a${loopRadius},${loopRadius} 0 0,1 ${gap},${gap}
        Z
        m${-2 * centerOffset},0
        a${loopRadius},${loopRadius} 0 0,0 ${gap},0
        L0,0
        L${-offset},${-offset}
        a${loopRadius},${loopRadius} 0 1,0 ${-gap},${gap}
        Z
    `;
};

export const generateSpiralPath = (size = 1, turns = 3, segments = 100) => {
    const points = [];
    const maxAngle = turns * 2 * Math.PI;
    const step = maxAngle / segments;
    const scale = size / 2;

    for (let a = 0; a <= maxAngle; a += step) {
        const r = scale * (a / maxAngle);
        const x = r * Math.cos(a);
        const y = r * Math.sin(a);
        points.push(`${x.toFixed(3)},${y.toFixed(3)}`);
    }

    return `M${points.join(" L")}`;
};
