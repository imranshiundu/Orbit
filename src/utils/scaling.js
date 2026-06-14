// Logarithmic scaling for distance to ensure outer planets are visible
export const scaleDistance = (auValue) => Math.log(auValue + 1) * 120;

// Square-root scaling for size to ensure small planets (Mercury/Mars) are visible next to Jupiter
export const scaleSize = (kmDiameter) => Math.sqrt(kmDiameter / 12742) * 5 + 1;
