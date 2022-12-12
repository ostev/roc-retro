import pinkNoiseProcessorUrl from "./pink-noise-processor.js?url"

export class AudioSource<T> {
    node: T
    panner: PannerNode
    context: AudioContext

    constructor(
        context: AudioContext,
        node: T,
        positionInfo: AudioSourcePositionInfo
    ) {
        // this.panner = context.createPanner()
        // this.panner.panningModel = "HRTF"
        // this.panner.distanceModel = "inverse"
        // this.panner.refDistance = 1
        // this.panner.maxDistance = 10000
        // this.panner.rolloffFactor = 1
        // this.panner.coneInnerAngle = 360
        // this.panner.coneOuterAngle = 0
        // this.panner.coneOuterGain = 0

        this.panner = new PannerNode(context, {
            panningModel: "HRTF",
            distanceModel: "inverse",
            refDistance: 1,
            maxDistance: 10000,
            rolloffFactor: 1,
            coneInnerAngle: 360,
            coneOuterAngle: 0,
            coneOuterGain: 0,
            positionX: positionInfo.position.x,
            positionY: positionInfo.position.y,
            positionZ: positionInfo.position.z,
            orientationX: positionInfo.orientation.x,
            orientationY: positionInfo.orientation.y,
            orientationZ: positionInfo.orientation.z
        })

        this.node = node

        this.context = context
    }

    updatePosition = (positionInfo: AudioSourcePositionInfo) => {
        setValuesAtTime(
            [
                this.panner.positionX,
                this.panner.positionY,
                this.panner.positionZ
            ],
            [
                positionInfo.position.x,
                positionInfo.position.y,
                positionInfo.position.z
            ],
            this.context.currentTime
        )
        setValuesAtTime(
            [
                this.panner.orientationX,
                this.panner.orientationY,
                this.panner.orientationZ
            ],
            [
                positionInfo.orientation.x,
                positionInfo.orientation.y,
                positionInfo.orientation.z
            ],
            this.context.currentTime
        )
    }
}

function setValuesAtTime(
    parameters: AudioParam[],
    values: number[],
    time: number
) {
    parameters.forEach((param, i) => param.setValueAtTime(values[i], time))
}

export interface AudioSourcePositionInfo {
    orientation: { x: number; y: number; z: number }
    position: { x: number; y: number; z: number }
}

export class AudioEngine {
    context: AudioContext

    channels: {
        sine: AudioSource<OscillatorNode>
        square: AudioSource<OscillatorNode>
        sawtooth: [OscillatorNode, OscillatorNode]
        // whiteNoise: WhiteNoiseGenerator
        pinkNoise: PinkNoiseGenerator
    }

    constructor() {
        ;(async (engine) => {
            this.context = new AudioContext()
            await this.context.audioWorklet.addModule(pinkNoiseProcessorUrl)
            const pinkNoise = new PinkNoiseGenerator(this.context)
        })()
    }

    close = () => {
        return this.context.close()
    }
}
