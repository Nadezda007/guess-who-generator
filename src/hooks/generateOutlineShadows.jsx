const generateOutlineShadows = (width, blur, color, detailing) => {
    if (width <= 0) return "none";

    const layers = [];
    const steps = Math.ceil(Math.max(2, width * detailing));
    const angleStep = (2 * Math.PI) / steps;

    for (let i = 0; i < steps; i++) {
        const angle = i * angleStep;
        const x = (Math.cos(angle) * width).toFixed(2);
        const y = (Math.sin(angle) * width).toFixed(2);
        layers.push(`${x}px ${y}px ${blur}px ${color}`);
    }

    return layers.join(", ");
};

export default generateOutlineShadows;