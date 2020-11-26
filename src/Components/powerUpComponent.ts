import * as ECS from '../../libs/pixi-ecs';
import * as PixiMatter from '../../libs/pixi-matter';
import * as Matter from "matter-js";
import {UtilFunctions} from '../Utils/utilFunctions';
import PIXISound from "pixi-sound";
import { Assets, Messages, Power_ups, P2_LIVES_TEXT, P1_LIVES_TEXT, Players_id, LEVEL_TIME_TEXT } from "../Utils/constants";
import { Player } from "../Model/player";
import * as PIXI from 'pixi.js';
import * as aphMath from '../../libs/aph-math';

export class PowerUpComponent extends ECS.Component {

    private binder: PixiMatter.MatterBind

    constructor(binder : PixiMatter.MatterBind ){
        super()
        this.binder = binder
    }

    onInit() {
        this.subscribe(
            Messages.PLAYER_LIVES_CHANGED,
            Messages.PLAYER_DEATH,
            Messages.FINISH_MESSAGE
        )
    }


    onUpdate(delta: number, absolute: number) {
        const ownerMatter = this.owner as PixiMatter.MatterBody

        let collides = Matter.Query.collides(ownerMatter.body, this.binder.mWorld.bodies)
        for (let pair of collides){
            let contains = UtilFunctions.pairLabelStartsWithString(pair,Power_ups.POWER_UP_BASE)
            let first = UtilFunctions.pairGetStartsWithString(pair, Power_ups.POWER_UP_BASE)
            let second = UtilFunctions.pairGetSecondPoint(pair, first.label)
            if(second.label == "P1" || second.label == "P2"){
                this.removePowerUp()
            }
        }
        if(collides.length){
       // this.binder.findSyncObjectForBody()
        }
    }
    onMessage(msg: ECS.Message) {
     /*   if (msg.action == Messages.PLAYER_LIVES_CHANGED) {
            let player = msg.data as Player
            this.updateLives(player.lives, this.getPlayerTextName(player.id))
        } */
    }

    private removePowerUp() {
        const ownerMatter = this.owner as PixiMatter.MatterBody
        Matter.Composite.remove(this.binder.mWorld, ownerMatter.body, true)
        this.owner.destroy()
    }
}