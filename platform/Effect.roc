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
            , readInput
            ]
    imports [pf.Frame.{FrameInfo}]
    generates Effect with
        [ after
        , map
        , always
        , forever
        , loop ]

render : List U8, Nat, Nat, List U32 -> Effect {}

log : F64 -> Effect {}

beginFrame : Effect FrameInfo
endFrame : FrameInfo, F64 -> Effect {}

readInput : Effect U32