export default class Box<T> {
    value : T = $state()!
    constructor(initial: T) {
        this.value = initial
    }
}