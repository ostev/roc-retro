interface Snake
    exposes [Snake, init, update, toSprites]
    imports [pf.Vec2.{ Vec2 }, pf.Gamepad.{ Gamepad }, pf.Sprite.{ Sprite }]

Snake : { body : List (Vec2 Nat), direction : Vec2 I32 }

init : Snake
init = {
    body: [{ x: 10, y: 10 }, { x: 11, y: 11 }],
    direction: { x: 1, y: 0 },
}

update : Snake, Gamepad -> Snake
update = \snake, gamepad ->
    direction =
        if gamepad.buttons.dpad.left then
            { x: -1, y: 0 }
        else if gamepad.buttons.dpad.right then
            { x: 1, y: 0 }
        else if gamepad.buttons.dpad.up then
            { x: 0, y: -1 }
        else if gamepad.buttons.dpad.down then
            { x: 0, y: 1 }
        else
            snake.direction

    newHead =
        when List.first snake.body is
            Ok head -> Vec2.add (Vec2.cast head) direction
            Err _ -> direction

    { snake &
        direction: direction,
        body:
            (if (List.len snake.body |> Num.intCast) > 1 then
                snake.body
                |> List.dropFirst
            else
                snake.body)
            |> List.prepend (Vec2.cast newHead),
    }

toSprites : Snake -> List (Sprite Nat)
toSprites = \snake ->
    snake.body
    |> List.map \bodyPart ->
        Sprite.fromImage
            [
                1,
                1,
                1,
                1,
                1,
                1,
                2,
                2,
                2,
                1,
                1,
                2,
                5,
                2,
                1,
                1,
                2,
                2,
                2,
                1,
                1,
                1,
                1,
                1,
                1,
            ]
            { width: 4, height: 4 }
            (Vec2.cast bodyPart |> Vec2.multiply { x: 4, y: 4 })
