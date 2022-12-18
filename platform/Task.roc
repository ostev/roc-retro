interface Task
    exposes 
        [ Task
        , succeed
        , fail
        , after
        , map
        , render ]
    imports [ pf.Effect ]

Task ok err : Effect.Effect (Result ok err)

succeed : val -> Task val *
succeed = \val ->
    Effect.always (Ok val)

fail : err -> Task * err
fail = \val ->
    Effect.always (Err val)

after : Task a err, (a -> Task b err) -> Task b err
after = \effect, f ->
    Effect.after
        effect
        \result ->
            when result is
                Ok val -> f val
                Err err ->  Task.fail err

map : Task a err, (a -> b) -> Task b err
map = \effect, f ->
    Effect.map
        effect
        \result ->
            when result is
                Ok val -> Ok (f val)
                Err err -> Err err

Framebuffer : { width : U32, height : U32, pixels : List U8 }

render : Framebuffer -> Task {} *
render = \framebuffer  ->
    Effect.map
        ( Effect.render
            framebuffer.pixels
            # framebuffer.width
            # framebuffer.height
        )
        (\_ -> Ok {})