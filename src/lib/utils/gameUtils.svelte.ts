export function generateRandomNumber(max: number, min: number = 0, exclusive = false) {
    const newMax = exclusive ? Math.floor(max) : Math.floor(max) + 1
    const newMin = Math.ceil(min)
    return Math.floor(Math.random() * (newMax - newMin) + newMin)
}

export function getEnemiesPerZone(zone: number) {
    if (zone <= 5) {
        return Math.max(1, (2*zone) - 1)
    }
    return 9 + Math.trunc((zone-5) / 2)
    // return Math.min(
    //     zone == 0 ? 1 : (2*zone) - 1,
    //     100,
    // )
}