export class AudioSource<T> {
    node: T
    panner: PannerNode
    context: AudioContext

    constructor(context: AudioContext,node: T, positionInfo: AudioSourcePositionInfo) {
        this.panner = context.createPanner()
        this.panner.panningModel = "HRTF"
        this.panner.distanceModel = "inverse"
        this.panner.refDistance = 1
        this.panner.maxDistance = 10000
        this.panner.rolloffFactor = 1
        this.panner.coneInnerAngle = 360
        this.panner.coneOuterAngle = 0
        this.panner.coneOuterGain = 0


        this.node = node

        this.context = context
    }

    updatePositionInfo = (info: AudioSourcePositionInfo) => {
        if (this.panner.orientationX) {
            this.panner.orientationX.setValueAtTime(1, this.context.currentTime)

        }
    }
}

export interface AudioSourcePositionInfo {
    orientation: { x: number, y: number, z: number }
    position: { x: number, y: number, z: number }
}

export class AudioEngine {
    context: AudioContext

    channels: {
        sine: AudioSource<OscillatorNode>,
        square: AudioSource<OscillatorNode>,
        sawtooth: [OscillatorNode, OscillatorNode],
        whiteNoise: WhiteNoiseGenerator,
        pinkNoise: PinkNoiseGenerator
    }

    constructor() {
        this.context = new AudioContext()
    }

    close = () => {
        return this.context.close()
    }


}