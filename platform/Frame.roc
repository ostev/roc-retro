interface Frame
    exposes [ Framebuffer, Palette, FrameInfo ]
    imports [ pf.Input, pf.Dimensions.{Dimensions} ]

Framebuffer : { dimensions: Dimensions, pixels : List U8 }

Palette : List U32

FrameInfo : { time: F64 }