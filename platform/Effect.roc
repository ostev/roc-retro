hosted Effect
    exposes [ Effect
            , after
            , map
            , always
            , forever
            , loop
            , render ]
    imports []
    generates Effect with
        [ after
        , map
        , always
        , forever
        , loop]

render : List U8 -> Effect {}