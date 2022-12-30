interface Sprite
    exposes [Sprite, fromImage, draw, drawSprites]
    imports [pf.Frame.{ Framebuffer }, pf.Vec2.{ Vec2 }, pf.Dimensions.{ Dimensions }]

Sprite a := { position : Vec2 a, image : List U8, dimensions : Dimensions }

fromImage : List U8, Dimensions, Vec2 a -> Sprite a
fromImage = \image, dimensions, position ->
    @Sprite {
        position: position,
        image: image,
        dimensions: dimensions,
    }

draw : Framebuffer, Sprite a -> Framebuffer
draw = \framebuffer, @Sprite sprite ->
    result =
        sprite.image
        |> List.walk
            { framebufferPixels: framebuffer.pixels, index: 0 }
            \{ framebufferPixels, index }, pixel ->
                spriteX = index % sprite.dimensions.width
                spriteY = index // sprite.dimensions.width

                framebufferX = Num.intCast spriteX + sprite.position.x
                framebufferY = Num.intCast spriteY + sprite.position.y

                framebufferIndex = framebufferX + framebufferY * Num.intCast framebuffer.dimensions.width

                {
                    framebufferPixels: if framebufferIndex >= 0 then
                        framebufferPixels
                        |> List.set (Num.toNat framebufferIndex) pixel
                    else
                        framebufferPixels,
                    index: index + 1,
                }

    { framebuffer & pixels: result.framebufferPixels }

drawSprites : Framebuffer, List (Sprite a) -> Framebuffer
drawSprites = \framebuffer, sprites ->
    sprites
    |> List.walk framebuffer \newFramebuffer, sprite ->
        draw newFramebuffer sprite
