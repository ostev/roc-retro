interface Program
    exposes [game]
    imports [pf.Task.{ Task }, pf.Render, pf.Input]

Game model : {
    init : model,
    update : model, Input.State, F32 -> model,
    render : model -> Render.Info,
}

# tick : F32, model -> Task model []
tick = \fps, model ->
    frameInfo <- Task.await Task.beginFrame
    gamepad <- Task.await (Task.readRawGamepad)
    _ <- Task.await
            (
                Task.render
                    { width: 256, height: 256, pixels: List.repeat 3 (256 * 256) }
                    (List.repeat 0xc0d0ef00 16)
            )
    _ <- Task.await (Task.endFrame frameInfo fps)
    Task.succeed (if List.len model < 200000 then List.append model gamepad else model)

# game : F32, model -> Task {} []
game = \fps, model ->
    # Note that, for whatever reason, keeping any value from
    # a Task causes the program to exceed the maximum call stack size.
    # For example, the following line cause this `RangeError: Maximum call stack size exceeded`:
    # gamepad <- Task.await (Task.readRawGamepad)

    # Task.loop {} \_ -> Task.map (tick fps) Step
    newModel <- Task.await (tick fps model)
    game fps newModel
