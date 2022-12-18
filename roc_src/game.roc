app "game"
    packages { pf: "../platform/main.roc" }
    imports []
    provides [render] to pf

render : List U8
render = List.repeat 0 (120)