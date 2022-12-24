interface Input
    exposes [ State, default ]
    imports [
            pf.Gamepad.{ Gamepad }
            ]

State : { justPressed: Gamepad, pressed: Gamepad }

default : State
default = { justPressed: Gamepad.default, pressed: Gamepad.default }