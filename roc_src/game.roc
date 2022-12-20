app "game"
    packages { pf: "../platform/main.roc" }
    imports [ pf.Task.{ Task }, pf.Effect.{ Effect } ]
    provides [ main ] to pf

main : Task {} []
main = 
    getFrameDeltaAsInt : Task (Effect U32) []
    getFrameDeltaAsInt = Task.getFrameDelta |> Task.map (\d -> Effect.map d Num.round)

    Task.after getFrameDeltaAsInt
        (\delta ->
            Task.render
                { width: 256, height: 256, pixels: List.repeat 3 (256 * 256)} 
                (List.repeat (delta) 16)
        )
