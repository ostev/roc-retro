app "game"
    packages { pf: "../platform/main.roc" }
    imports [ pf.Task.{ Task } ]
    provides [ main ] to pf

main : Task {} []
main = Task.render { width: 256, height: 256, pixels: List.repeat 3 (256 * 256)}