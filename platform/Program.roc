interface Program
    exposes [game]
    imports [pf.Task.{ Task }, pf.Render, pf.Input, pf.Gamepad.{ Gamepad }]

Game model : {
    fps : Nat,
    init : model,

    # TODO add delta to previous frame
    update : model, Gamepad -> model,
    render : model -> Render.Info,
}

tick : model, (model, Gamepad -> model), (model -> Render.Info), Nat -> Task model []
tick = \model, update, render, fps ->
    frameInfo <- Task.await Task.beginFrame
    gamepad <- Task.await (Task.readGamepad)

    newModel = update model gamepad
    renderInfo = render newModel

    _ <- Task.await
            (
                Task.render
                    renderInfo.framebuffer
                    renderInfo.palette
            )

    _ <- Task.await (Task.endFrame frameInfo (Num.toFrac fps))

    Task.succeed newModel

game : Game model -> Task {} []
game = \config ->
    # Note that, for whatever reason, keeping any value from
    # a Task causes the program to exceed the maximum call stack size.
    # For example, the following line cause this `RangeError: Maximum call stack size exceeded`:
    # gamepad <- Task.await (Task.readRawGamepad)
    helper = \model ->
        newModel <- Task.await (tick model config.update config.render config.fps)
        helper newModel

    helper config.init

