interface Input
    exposes [ State ]
    imports [ pf.Task.{ Task }, pf.Gamepad.{ Gamepad }]

State : { gamepad: Gamepad }
