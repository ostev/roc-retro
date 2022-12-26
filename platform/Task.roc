interface Task
    exposes
    [
        Task,
        succeed,
        fail,
        await,
        loop,
        map,
        render,
        beginFrame,
        endFrame,
        readGamepad,
        log,
        readRawGamepad
    ]
    imports [
        pf.Effect.{ Effect },
        pf.Frame.{ Framebuffer, Palette, FrameInfo },
        pf.Gamepad.{Gamepad}
    ]

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

loop : state, (state -> Task [Step state, Done done] err) -> Task done err
loop = \state, step ->
    looper = \current ->
        step current
        |> Effect.map
            \res ->
                when res is
                    Ok (Step newState) -> Step newState
                    Ok (Done done) -> Done (Ok done)
                    Err e -> Done (Err e)

    Effect.loop state looper

map : Task a err, (a -> b) -> Task b err
map = \effect, f ->
    Effect.map
        effect
        \result ->
            when result is
                Ok val -> Ok (f val)
                Err err -> Err err

# requestAnimationFrame : Task {} [] -> Task {} []
# requestAnimationFrame = \task ->
#     Effect.map
#         ( Effect.requestAnimationFrame task )
#         (\_ -> Ok {})
render : Framebuffer, Palette -> Task {} *
render = \framebuffer, palette ->
    Effect.map
        (
            Effect.render
                framebuffer.pixels
                framebuffer.width
                framebuffer.height
                palette
        )
        (\_ -> Ok {})

beginFrame : Task FrameInfo *
beginFrame =
    Effect.map
        Effect.beginFrame
        (\frameInfo -> Ok frameInfo)

endFrame : FrameInfo, F64 -> Task {} *
endFrame = \frameInfo, frameTime ->
    Effect.map
        (Effect.endFrame frameInfo frameTime)
        (\_ -> Ok {})

readRawGamepad = Effect.map Effect.readInput (\input -> Ok input)

readGamepad: Task Gamepad *
readGamepad=
    Effect.map
        Effect.readInput
        (\input ->
            input
            |> Gamepad.fromU32
            |> Ok
        )
    

log : F64 -> Task {} *
log = \val ->
    Effect.map
        (Effect.log val)
        (\_ -> Ok {})
