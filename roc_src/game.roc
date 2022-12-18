app "game"
    packages { pf: "../platform/main.roc" }
    imports [ pf.Task.{ Task } ]
    provides [ main ] to pf

main : Task {} []
main = Task.render { width: 2, height: 2, pixels: [1, 2, 3, 4]}