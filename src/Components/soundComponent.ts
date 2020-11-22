import * as ECS from '../../libs/pixi-ecs';
import PIXISound from "pixi-sound";
import { Assets, Messages } from "../Utils/constants";

export class SoundComponent extends ECS.Component {
    private playingMessage: string
    private levelFinished: boolean = false

    onInit() {
        this.subscribe(
            Messages.FINISH_MESSAGE,
            Messages.PLAYER_DEATH
        )
    }
    onMessage(msg: ECS.Message) {
        super.onMessage(msg)
        if(this.levelFinished == true ){
            return;
        }
        if (msg.action == Messages.FINISH_MESSAGE) {
                PIXISound.stopAll()
                let sound = Assets.LEVEL_COMPLETE_SOUND
                PIXISound.play(sound)
                this.levelFinished = true
        }
        this.playingMessage = msg.action
    }
}