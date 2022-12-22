hosted Effect
    exposes [ Effect
            , after
            , map
            , always
            , forever
            , loop
            , render
            , beginFrame
            , endFrame
            , log
            , FrameInfo ]
    imports []
    generates Effect with
        [ after
        , map
        , always
        , forever
        , loop ]

render : List U8, Nat, Nat, List U32 -> Effect {}

log : F64 -> Effect {}

## Time is in milliseconds
FrameInfo : { time: F64 }
beginFrame : Effect FrameInfo
endFrame : FrameInfo, F64 -> Effect {}