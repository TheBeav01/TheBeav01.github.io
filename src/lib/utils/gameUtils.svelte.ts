export function generateRandomNumber(max: number, min: number = 0, exclusive = false) {
    const newMax = exclusive ? Math.floor(max) : Math.floor(max) + 1
    const newMin = Math.ceil(min)
    return Math.floor(Math.random() * (newMax - newMin) + newMin)
}

export function getEnemiesPerZone(zone: number) {
    return Math.min(
        zone == 0 ? 1 : (2*zone) - 1,
        100,
    )
}