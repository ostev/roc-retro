app "game"
    packages { pf: "../platform/main.roc" }
    imports [pf.Task.{ Task }, pf.Program.{ game }]
    provides [main] to pf

main : Task {} []
main =
    game {
        fps: 100,
        init: Pair (List.repeat 10 (256*256) |> Box.box) (Box.box []),
        # This leaks memory
        update: \(Pair pixels oldPixels), gamepad ->
            (Pair (List.repeat 10 (256*256) |> Box.box) oldPixels),
        render: \(Pair pixels oldPixels) -> {
            framebuffer: {
                pixels: Box.unbox pixels,
                height: 256,
                width: 256,
            },
            palette: Box.unbox oldPixels |> List.map Num.toU32,
        },
    }
