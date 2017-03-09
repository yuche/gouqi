// tslint:disable-next-line:no-var-requires
const EventEmitter = require('react-native/Libraries/EventEmitter/EventEmitter')

export const emitter = new EventEmitter()


export function assign<A extends B, B extends Object>(source: A, assignments: B): A {
    return Object.assign({}, source, assignments)
}
