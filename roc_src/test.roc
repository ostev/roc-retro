app "test"
    packages { pf: "../platform/main.roc" }
    imports [
    ]
    provides [main] to pf


Vec2 a : { x : Int a, y : Int a }

cast : Vec2 (Int a) -> I64
cast = \a ->
    Num.intCast a.x

main : I64
main = cast {x: 5, y: 4}