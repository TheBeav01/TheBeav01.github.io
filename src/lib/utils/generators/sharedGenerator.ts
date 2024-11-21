export interface Spawnable {
    // Default: 100
    spawnWeight?: number
}


export function pickItemFromWeightedList<T extends Spawnable>(list: T[]) {
    const fixedWeights = list.map(i => {
        if (i.spawnWeight === undefined) {
            i.spawnWeight = 100
        }
        return i
    })
    const weight = fixedWeights.reduce((l, c, _i, _list) => l + c.spawnWeight!, 0)
    const rand = Math.random()
    const final = rand * weight
    let total = 0
    for(const item of fixedWeights) {
        total += item.spawnWeight!
        if (total >= final) {
            return item
        }
    }
    //Else: Randomly pick. If we still overflow, pick last.
    const scaled = Math.floor(rand * list.length)
    return list[scaled] ?? list[list.length - 1]
}