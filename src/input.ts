enum Button {
    Up = "w",
    Down = "s",
    Left = "a",
    Right = "d",

    A = "j",
    B = "k",
    X = "u",
    Y = "i",

    Plus = "=",
    Minus = "-"
}

export class InputReader {
    private keysPressed: Map<string, boolean> = new Map()
    private destinationBuffer: Uint32Array

    constructor(destinationBuffer: Uint32Array) {
        this.destinationBuffer = destinationBuffer

        document.addEventListener("keydown", (event) => {
            this.keysPressed.set(event.key, true)
            this.updateDestinationBuffer()
        })

        document.addEventListener("keyup", (event) => {
            this.keysPressed.set(event.key, false)
            this.updateDestinationBuffer()
        })
    }

    updateDestinationBuffer = () => {
        this.destinationBuffer[0] = this.read()
    }

    read = (): number => {
        const buttonCodes: number[] = Array.from(this.keysPressed).map(
            ([button, isPressed]) => {
                switch (button) {
                    case Button.A:
                        return isPressed ? 0x00000001 : 0
                    case Button.B:
                        return isPressed ? 0x00000002 : 0
                    case Button.X:
                        return isPressed ? 0x00000004 : 0
                    case Button.Y:
                        return isPressed ? 0x00000008 : 0
                    case Button.Up:
                        return isPressed ? 0x00000010 : 0
                    case Button.Down:
                        return isPressed ? 0x00000020 : 0
                    case Button.Left:
                        return isPressed ? 0x00000040 : 0
                    case Button.Right:
                        return isPressed ? 0x00000080 : 0
                    case Button.Plus:
                        return isPressed ? 0x00000100 : 0
                    case Button.Minus:
                        return isPressed ? 0x00000200 : 0
                    default:
                        return 0
                }
            }
        )

        return buttonCodes.reduce(
            (buttonsPressed, button) => buttonsPressed | button,
            0
        )
    }
}
