platform "echo-in-web-assembly"
    requires {} { render : List U8 }
    exposes []
    packages {}
    imports []
    provides [mainForHost]

mainForHost : List U8
mainForHost = render