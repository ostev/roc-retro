app "game"
    packages { pf: "../platform/main.roc" }
    imports [pf.Task.{ Task }, pf.Program.{ game }]
    provides [main] to pf

main : Task {} []
main =
    # Task.succeed {}
    game 120
