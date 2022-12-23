interface Render
    exposes [ Info ]
    imports [ pf.Task.{ Task }, pf.Frame ]

Info : { framebuffer: Frame.Framebuffer, palette: Frame.Palette }