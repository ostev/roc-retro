app "game"
    packages { pf: "../platform/main.roc" }
    imports []
    provides [main] to pf

main : List U8
main = List.repeat 5 (256 * 224)