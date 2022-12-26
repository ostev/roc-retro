interface Gamepad
    exposes [ Gamepad
            , Buttons
            , Dpad
            , FaceButtons
            , SystemButtons
            , fromU32
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
    { buttons: defaultButtons
    }

fromU32 : U32 -> Gamepad
fromU32 = \state ->
    {
        buttons: {
            face: {
                a: (state |> Num.bitwiseAnd 0x00000001) != 0,
                b: (state |> Num.bitwiseAnd 0x00000002) != 0,
                x: (state |> Num.bitwiseAnd 0x00000004) != 0,
                y: (state |> Num.bitwiseAnd 0x00000008) != 0,

            },
            dpad: {
                up: (state |> Num.bitwiseAnd 0x00000010) != 0,
                down: (state |> Num.bitwiseAnd 0x00000020) != 0,
                left: (state |> Num.bitwiseAnd 0x00000040) != 0,
                right: (state |> Num.bitwiseAnd 0x00000080) != 0,

            },
            system: {
                plus: (state |> Num.bitwiseAnd 0x00000100) != 0,
                minus: (state |> Num.bitwiseAnd 0x00000200) != 0,
            }
        }
    }