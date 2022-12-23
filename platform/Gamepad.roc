interface Gamepad
    exposes [ Gamepad ]
    imports []

Buttons :
    {
        a : Bool,
        b : Bool,
        x : Bool,
        y : Bool,
        l : Bool,
        r : Bool,
        zl : Bool,
        zr : Bool,
        dpad: Dpad
        lStick : Bool,
        rStick : Bool,
        plus : Bool,
        minus : Bool,
    }

Dpad : { up : Bool, down : Bool, left : Bool, right : Bool }

Analog :
    {
        LStick : { x : F32, y : F32 },
        RStick : { x : F32, y : F32 },
    }

Gamepad : { buttons : Buttons, analog : Analog}