platform "echo-in-web-assembly"
    requires {} { main: List U8 }
    exposes []
    packages {}
    imports []
    provides [mainForHost]

mainForHost = main