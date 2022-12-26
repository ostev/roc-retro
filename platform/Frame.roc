interface Frame
    exposes [ Framebuffer, Palette, FrameInfo ]
    imports [ pf.Input ]

Framebuffer : { width : Nat, height : Nat, pixels : List U8 }

Palette : List U32

FrameInfo : { time: F64 }