app "game"
    packages { pf: "../platform/main.roc" }
    imports [pf.Task.{ Task }, pf.Program.{ game }]
    provides [main] to pf

main : Task {} []
main =
    game {
        fps: 120,
        init: 0,
        update: \model, gamepad ->
            model |> Num.addWrap 1,
        render: \model -> {
            framebuffer: {
                pixels: List.repeat 0 (256 * 256),
                height: 256,
                width: 256,
            },
            palette: List.repeat 0 16,
        },
    }
