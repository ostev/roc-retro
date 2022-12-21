app "game"
    packages { pf: "../platform/main.roc" }
    imports [ pf.Task.{ Task } ]
    provides [ main ] to pf

main : Task {} []
main = 
    # getFrameDeltaAsInt : Task (Effect U32) []
    # getFrameDeltaAsInt = Task.getFrameDelta |> Task.map (\d -> Effect.map d Num.round)

    # frameDelta <- Task.await Task.getFrameDelta
    _ <- Task.await Task.waitForAnimationFrame

    Task.render
        { width: 256, height: 256, pixels: List.repeat 3 (256 * 256)} 
        (List.repeat 0xff000000 16)
