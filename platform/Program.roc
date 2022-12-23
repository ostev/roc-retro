interface Program
    exposes [ game ]
    imports [ pf.Task.{ Task }, pf.Render, pf.Input]

Game model : { init : model
            , update : (model, Input.State, F32 -> model)
            , render : (model -> Render.Info)
            }

tick = \fps ->
    frameInfo <- Task.await Task.beginFrame
    _ <- Task.await
        ( Task.render
            { width: 256, height: 256, pixels: List.repeat 3 (256 * 256)}
            (List.repeat 0xc0d0ef00 16)
        )
    (Task.endFrame frameInfo fps)

game = \fps ->
    # _ <- Task.await (tick fps)
    game fps
