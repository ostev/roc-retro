app "game"
    packages { pf: "../platform/main.roc" }
    imports [ pf.Task.{ Task }, pf.Program.{game} ]
    provides [ main ] to pf

main : Task {} []
main =
    input <- Task.await Task.readInput

    _ <- Task.await (Task.log (Num.toFrac input))

    Task.succeed {}