/* Math utilities */
export const degToRad = (deg: number): number => deg * Math.PI / 180
export const radToDeg = (rad: number): number => rad * 180 / Math.PI
export const percToDeg = (perc: number, maxDeg: number = 360): number => perc / 100 * maxDeg
export const percToRad = (perc: number, maxDeg: number = 360): number => degToRad(percToDeg(perc, maxDeg))
export const valToDeg = (value: number, total: number, maxDeg: number = 360): number => value / total * maxDeg
export const valToPerc = (value: number, total: number): number => value / total * 100
