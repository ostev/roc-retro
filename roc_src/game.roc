app "game"
    packages { pf: "../platform/main.roc" }
    imports [pf.Task.{ Task }, pf.Program.{ game }
            , Snake.{Snake}, pf.Sprite.{Sprite}]
    provides [main] to pf

main : Task {} []
main =
    game {
        fps: 60,
        init:  init,
        update: update,
        render: render,
    }

Model : {snake: Snake}

init : Model
init = {snake: Snake.init}

update : Model, Gamepad -> Model
update =\{snake}, gamepad-> {snake: Snake.update snake gamepad}

palette: List U32
palette = [0x699fad00
    ,0x3a708e00
    ,0x2b454f00
    ,0x11121500
    ,0x151d1a00
    ,0x1d323000
    ,0x314e3f00
    ,0x4f5d4200
    ,0x9a9f8700
    ,0xede6cb00
    ,0xf5d89300
    ,0xe8b26f00
    ,0xb6834c00
    ,0x704d2b00
    ,0x40231e00
    ,0x15101500]

render : Model -> Framebuffer
render  =\{snake}->
    sprites = Snake.toSprites snake

    blankFramebuffer : Framebuffer
    blankFramebuffer =
        {pixels: (List.repeat 5 (256*256)),
        dimensions: {width: 256, height: 256}}
    
    framebuffer = blankFramebuffer
        |> Framebuffer.drawSprites sprites
    
    {framebuffer: framebuffer, palette: palette}