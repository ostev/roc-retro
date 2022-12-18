app "game"
    packages { pf: "../platform/main.roc" }
    imports []
    provides [render] to pf

render : List U8
render = [1, 2, 3, 4]