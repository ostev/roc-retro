interface Task
    exposes 
        [ Task
        , succeed
        , fail
        , await
        , map
        , render
        , getFrameDelta
        , waitForAnimationFrame ]
    imports [ pf.Effect.{ Effect } ]

Task ok err : Effect (Result ok err)

succeed : val -> Task val *
succeed = \ok ->
    Effect.always (Ok ok)

fail : err -> Task * err
fail = \err ->
    Effect.always (Err err)

await : Task a err, (a -> Task b err) -> Task b err
await = \task, f ->
    Effect.after
        task
        \result ->
            when result is
                Ok val -> f val
                Err err -> Task.fail err

map : Task a err, (a -> b) -> Task b err
map = \effect, f ->
    Effect.map
        effect
        \result ->
            when result is
                Ok val -> Ok (f val)
                Err err -> Err err

Framebuffer : { width : Nat, height : Nat, pixels : List U8 }
Palette : List U32

# requestAnimationFrame : Task {} [] -> Task {} []
# requestAnimationFrame = \task ->
#     Effect.map
#         ( Effect.requestAnimationFrame task )
#         (\_ -> Ok {})

render : Framebuffer, Palette -> Task {} *
render = \framebuffer, palette  ->
    Effect.map
        ( Effect.render
            framebuffer.pixels
            framebuffer.width
            framebuffer.height
            palette
        )
        (\_ -> Ok {})

getFrameDelta : Task F64 []
getFrameDelta =
    Effect.getFrameDelta
    |> Effect.map Ok

waitForAnimationFrame : Task {} []
waitForAnimationFrame =
    Effect.waitForAnimationFrame
    |> Effect.map Ok
