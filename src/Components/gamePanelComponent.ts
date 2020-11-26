import * as ECS from '../../libs/pixi-ecs';
import PIXISound from "pixi-sound";
import { Assets, Messages, P2_LIVES_TEXT, P1_LIVES_TEXT, Players_id, LEVEL_TIME_TEXT } from "../Utils/constants";
import { Player } from "../Model/player";
import * as PIXI from 'pixi.js';
import * as aphMath from '../../libs/aph-math'

export class GamePanelComponent extends ECS.Component {
    private lastTime: number
    private isGameFinished: boolean = false
    
    onInit() {
        this.subscribe(
            Messages.PLAYER_LIVES_CHANGED,
            Messages.PLAYER_DEATH,
            Messages.FINISH_MESSAGE
        )
    }


    onUpdate(delta: number, absolute: number) {
        const timeText: ECS.Text = this.owner.scene.findObjectByName(LEVEL_TIME_TEXT) as ECS.Text;

        if (!this.isGameFinished) {
            let timeNow = (absolute / 1000)
            timeText.text = timeNow.toPrecision(3)
            this.lastTime = timeNow
        }
    }
    onMessage(msg: ECS.Message) {
        if (msg.action == Messages.PLAYER_LIVES_CHANGED) {
            let player = msg.data as Player
            this.updateLives(player.lives, this.getPlayerTextName(player.id))
        }
        if (msg.action == Messages.FINISH_MESSAGE) {
            this.isGameFinished = true
            const timeText: ECS.Text = this.owner.scene.findObjectByName(LEVEL_TIME_TEXT) as ECS.Text;
            timeText.text = this.lastTime.toPrecision(4)
        }
        if (msg.action == Messages.PLAYER_DEATH) {
            let player = msg.data as Player
            this.updateLives(0, this.getPlayerTextName(player.id))
        }
    }
    updateLives(lives: number, playerTextName: string) {
        const PlayerLives: ECS.Text = this.owner.scene.findObjectByName(playerTextName) as ECS.Text;

        PlayerLives.style = {
            ...PlayerLives.style,
            fill: this.getColorForLifeValue(lives)
        }
        PlayerLives.text = lives.toPrecision(3).toString() + " %"
    }
    getPlayerTextName(playerId: string): string {
        switch (playerId) {
            case Players_id.P1:
                return P1_LIVES_TEXT;
            case Players_id.P2:
                return P2_LIVES_TEXT;
            default:
                break;
        }
    }
    getColorForLifeValue(lives: number): string {
        return '#3360FF'
    }
}