app "game"
    packages { pf: "../platform/main.roc" }
    imports [pf.Task.{ Task }, pf.Program.{ game }]
    provides [main] to pf

main : Task {} []
main =
    game {
        fps: 120,
        init : 0,
        update: \model, gamepad ->
            model |> Num.addWrap 1,
    }
