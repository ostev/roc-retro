app "game"
    packages { pf: "../platform/main.roc" }
    imports [pf.Task.{ Task }, pf.Program.{ game }]
    provides [main] to pf

main : Task {} []
main =
    game {
        fps: 100,
        init: List.repeat 0 (256 * 256),
        update: \pixels, gamepad ->
            pixels |> List.map (\x -> if x >= 15 then 0 else x + 1),
        render: \pixels -> {
            framebuffer: {
                pixels: pixels,
                height: 256,
                width: 256,
            },
            palette: List.repeat 5 (256 * 256),
        },
    }
