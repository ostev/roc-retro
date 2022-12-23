interface Gamepad
    exposes [ Gamepad
            , Buttons
            , Dpad
            , FaceButtons
            , SystemButtons
            , default ]
    imports []

Buttons :
    {
        face: FaceButtons,
        dpad: Dpad,
        system: SystemButtons,
    }

defaultFaceButtons : FaceButtons
defaultFaceButtons =
    {
        a: Bool.false,
        b: Bool.false,
        x: Bool.false,
        y: Bool.false,
    }

defaultDpad : Dpad
defaultDpad =
    {
        up: Bool.false,
        down: Bool.false,
        left: Bool.false,
        right: Bool.false,
    }

defaultSystemButtons : SystemButtons
defaultSystemButtons =
    {
        plus: Bool.false,
        minus: Bool.false,
    }

defaultButtons : Buttons
defaultButtons =
    {
        face: defaultFaceButtons,
        dpad: defaultDpad,
        system: defaultSystemButtons,
    }

Dpad : { up : Bool, down : Bool, left : Bool, right : Bool }
FaceButtons : { a : Bool, b : Bool, x : Bool, y : Bool }
SystemButtons : { plus: Bool, minus: Bool }

Gamepad : { buttons : Buttons }

default : Gamepad
default =
    { buttons:defaultButtons
        
    }