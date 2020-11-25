import * as Matter from "matter-js";
import { MAP_TYPE_OCTILE } from "../../libs/aph-math";
import * as ECS from '../../libs/pixi-ecs';
import * as PixiMatter from '../../libs/pixi-matter';
import { Player } from "../Model/player";
import { Rope } from "../Model/rope";
import { ControlKey, ROTATE_COEFFICIENT, INIT_PLAYER_SPEED, ROPE_SPEED_INCREASE, Players_id, PLAYER_HEIGHT, P1_ROPE, P2_ROPE, FINISH_LABEL,Messages } from "../utils/constants";


// collission example:  https://codepen.io/lonekorean/pen/KXLrVX

export class PlayerController extends ECS.Component {
    private keyInputsComp: ECS.KeyInputComponent
    private turn_left_key: number
    private turn_right_key: number
    private shoot_rope_key: number
    private release_rope_key: number

    private binder: PixiMatter.MatterBind

    private player: Player

    private rope: Rope = null
    private ropeSpeedIncrease: number = ROPE_SPEED_INCREASE

    private finishMessageSend: boolean = false



    constructor(binder: PixiMatter.MatterBind, player: Player) {
        super()
        this.binder = binder
        this.player = player
    }

    onInit() {
        this.keyInputsComp = this.scene.stage.findComponentByName<ECS.KeyInputComponent>(ECS.KeyInputComponent.name)

        const ownerMatter = this.owner as PixiMatter.MatterBody
        this.player.playerMatter = ownerMatter;

        if (this.player.playerNumber == 1) {

            this.turn_left_key = ControlKey.TURN_LEFT_P1
            this.turn_right_key = ControlKey.TURN_RIGHT_P1
            this.shoot_rope_key = ControlKey.SHOOT_ROPE_P1
            this.release_rope_key = ControlKey.RELEASE_ROPE_P1
        }
        else if (this.player.playerNumber == 2) {

            this.turn_left_key = ControlKey.TURN_LEFT_P2
            this.turn_right_key = ControlKey.TURN_RIGHT_P2
            this.shoot_rope_key = ControlKey.SHOOT_ROPE_P2
            this.release_rope_key = ControlKey.RELEASE_ROPE_P2
        }
    }

    onUpdate(delta: number, absolute: number) {
        let rotateSpeed = ROTATE_COEFFICIENT * delta
        let playerMatter = this.player.playerMatter
        let ropeExists = (this.rope != null)

        if (this.keyInputsComp.isKeyPressed(this.turn_left_key)) {
            Matter.Body.rotate(playerMatter.body, rotateSpeed)
        } else if (this.keyInputsComp.isKeyPressed(this.turn_right_key)) {
            Matter.Body.rotate(playerMatter.body, -(rotateSpeed))
        }

        // work with rope
        if (this.keyInputsComp.isKeyPressed(this.release_rope_key)) {
            if (ropeExists) {
                this.releaseRope(this.player);
                ropeExists = false
            }
        } else if (this.keyInputsComp.isKeyPressed(this.shoot_rope_key)) {
            if (ropeExists) {
                this.playerMovement(delta)
            }
            else {
                this.rope = new Rope(this.binder, this.player)
            }
        }
        if (ropeExists) {
            if (this.rope.isRopeEndStatic()) {
                this.shortenRopeLength(this.player)
            }
        }
        Matter.Events.on(this.binder.mEngine, 'collisionStart', (event: any) => {
            this.checkCollissions(event);
        });
    }

    public releaseRope(player: Player) {
        // předám rychlost

        if (this.rope.isRopeEndStatic() == true) {
            let playerSpeed = player.speed
            let releasedRopeAngle = this.rope.releasedRopeAngle
            Matter.Body.setVelocity(player.playerMatter.body, {
                x: (playerSpeed) * Math.cos(releasedRopeAngle),
                y: (playerSpeed) * Math.sin(releasedRopeAngle)
            })
            this.rope.destroyRopeString()
        }
        // remove constraint and ropeEnd
        this.rope.destroyRope()
        this.rope = null
    }

    public shortenRopeLength(player: Player) {
        let ropeLength = this.rope.getRopeLength() - player.speed
        if (ropeLength > PLAYER_HEIGHT) {
            this.rope.setRopeLength(ropeLength)
        }
        else {
            this.releaseRope(player)
        }
    }

    // rope speed is actualized here (with delta)
    public playerMovement(delta: number) {
        let playerSpeed = this.player.speed
        // rope shorten length
        if (this.rope.ropeStringExists()) {
            this.player.speed = playerSpeed + (this.ropeSpeedIncrease * delta)
        }
        // rope end set movement
        else {
            let newSpeed = playerSpeed + (this.ropeSpeedIncrease * delta)
            let ropeMatter = this.rope.ropeMatter
            Matter.Body.setVelocity(ropeMatter.body,
                {
                    x: (newSpeed) * Math.cos(this.rope.releasedRopeAngle),
                    y: (newSpeed) * Math.sin(this.rope.releasedRopeAngle)
                }
            )
            this.player.speed = newSpeed
        }
    }

    // name: String, pairs : any,  source : any
    private checkCollissions = (event: any) => {
        let pairs = event.pairs;
        for (let pair of pairs) {

            if (this.rope?.isRopeEndStatic() == false) {
                let isRopeEndCollision = this.pairContainsLabel(pair, this.rope.ropeLabel)
                if (isRopeEndCollision == true) {
                    let secondPoint = this.pairGetSecondPoint(pair, this.rope.ropeLabel)
                    // nesmí se chytit za soupeře
                    if(secondPoint.label == Players_id.P1 ||
                       secondPoint.label == Players_id.P2 ||
                       secondPoint.label == P1_ROPE ||
                       secondPoint.label == P2_ROPE )
                    {
                        continue;
                    }
                    this.rope.ropeEndcollission(this.player)
                }
            }
            let isfinishCollision = (this.pairContainsLabel(pair, this.player.id) && this.pairContainsLabel(pair, FINISH_LABEL) )
            if(isfinishCollision && this.finishMessageSend== false){
                this.finishMessageSend = true
                this.sendMessage(Messages.FINISH_MESSAGE, this.player)
            }
         //   isObstacleCollision = (this.pairContainsLabel(pair, this.player.id) &&  this.pairLabelContainsString(pair, FINISH_LABEL) )
           /* let isObstacleCollision = true
            if(isObstacleCollision){
                // get obstacle
                // update lives
                this.player.lives = 10
                //sendMessage
                this.sendMessage(Messages.PLAYER_LIVES_CHANGED, this.player)
            }*/
         //   let isPlayerObstacleCollision =



         /*              TODO: reagovat podle toho, jaký je to constraint. např ubírat životy...

            switch (secondLabel) {
                case 'reset':
                    break;
                case 'bumper':
                    //  pingBumper(pair.bodyA);
                    break;
            }
            */
        }
        // only players components have labels

    }
    private pairContainsLabel(pair, wantedLabel): boolean {
        return (pair.bodyA.label == wantedLabel || pair.bodyB.label == wantedLabel)
    }
    private pairGetSecondPoint(pair, knownLabel) {
        return (pair.bodyA.label == knownLabel) ? pair.bodyB : pair.bodyA
    }
}


