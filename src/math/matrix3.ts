export type Matrix3 = [
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number
]

/// Multiply two 3x3 matrices
export const multiply = (a: Matrix3, b: Matrix3): Matrix3 => [
    b[0] * a[0] + b[1] * a[3] + b[2] * a[6],
    b[0] * a[1] + b[1] * a[4] + b[2] * a[7],
    b[0] * 
]
