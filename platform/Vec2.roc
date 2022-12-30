interface Vec2
    exposes [Vec2, multiply, add, subtract, divide, dot, cast]
    imports []

Vec2 a : { x : Int a, y : Int a }

multiply : Vec2 a, Vec2 a -> Vec2 a
multiply = \a, b ->
    { x: a.x * b.x, y: a.y * b.y }

add : Vec2 a, Vec2 a -> Vec2 a
add = \a, b ->
    { x: a.x + b.x, y: a.y + b.y }

subtract : Vec2 a, Vec2 a -> Vec2 a
subtract = \a, b ->
    { x: a.x - b.x, y: a.y - b.y }

divide : Vec2 a, Vec2 a -> Vec2 a
divide = \a, b ->
    { x: a.x // b.x, y: a.y // b.y }

dot : Vec2 a, Vec2 a -> Int a
dot = \a, b ->
    a.x * b.x + a.y * b.y

cast : Vec2 (Int a) -> Vec2 (Int b)
cast = \a ->
    { x: Num.intCast a.x, y: Num.intCast a.y }
