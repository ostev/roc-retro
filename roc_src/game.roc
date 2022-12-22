app "game"
    packages { pf: "../platform/main.roc" }
    imports [ pf.Task.{ Task } ]
    provides [ main ] to pf

tick =
    frameInfo <- Task.await Task.beginFrame

    _ <- Task.await
        ( Task.render
            { width: 256, height: 256, pixels: List.repeat 3 (256 * 256)}
            ( List.repeat (Num.floor frameInfo.time * 100) 16 )
        )
    
    # _ <- Task.await
    #     ( Task.log frameInfo.time

    #     )
    
    (Task.endFrame frameInfo 60)

main : Task {} []
main = 
    # getFrameDeltaAsInt : Task (Effect U32) []
    # getFrameDeltaAsInt = Task.getFrameDelta |> Task.map (\d -> Effect.map d Num.round)

    # frameDelta <- Task.await Task.getFrameDelta
    Task.loop {} \_ -> Task.map tick Step
