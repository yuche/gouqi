export function assign<A extends B, B extends Object>(source: A, assignments: B): A {
    return Object.assign({}, source, assignments);
}
