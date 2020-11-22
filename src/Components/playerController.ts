import * as Matter from "matter-js";
import { MAP_TYPE_OCTILE } from "../../libs/aph-math";
import * as ECS from '../../libs/pixi-ecs';
import * as PixiMatter from '../../libs/pixi-matter';
import { Player } from "../Model/player";
import { Rope } from "../Model/rope";
import { ControlKey, ROTATE_COEFFICIENT, INIT_PLAYER_SPEED, ROPE_SPEED_INCREASE, Players_id, PLAYER_HEIGHT, P1_ROPE, P2_ROPE } from "../utils/constants";


// collission example:  https://codepen.io/lonekorean/pen/KXLrVX

export class PlayerController extends ECS.Component {
    private keyInputsComp: ECS.KeyInputComponent
    private turn_left_key: number
    private turn_right_key: number
    private shoot_rope_key: number
    private release_rope_key: number

    private binder: PixiMatter.MatterBind


    private ropeMatter: PixiMatter.MatterBody
    private ropeConstraint: PixiMatter.MatterConstraint

    private player: Player

    private rope: Rope

    private releasedRopeAngle: number
    private ropeSpeedIncrease: number = ROPE_SPEED_INCREASE
    private ropeLabel: string




    constructor(binder: PixiMatter.MatterBind, player: Player) {
        super()
        this.binder = binder
        this.player = player
    }

    onInit() {
        this.keyInputsComp = this.scene.stage.findComponentByName<ECS.KeyInputComponent>(ECS.KeyInputComponent.name)

        const ownerMatter = this.owner as PixiMatter.MatterBody
        this.player.playerMatter = ownerMatter;

        //const ownerMatter = this.owner as PixiMatter.MatterBody
        ownerMatter.body.label = this.player.id

        if (this.player.playerNumber == 1) {
            this.ropeLabel = P1_ROPE

            this.turn_left_key = ControlKey.TURN_LEFT_P1
            this.turn_right_key = ControlKey.TURN_RIGHT_P1
            this.shoot_rope_key = ControlKey.SHOOT_ROPE_P1
            this.release_rope_key = ControlKey.RELEASE_ROPE_P1
        }
        else if (this.player.playerNumber == 2) {
            this.ropeLabel = P2_ROPE

            this.turn_left_key = ControlKey.TURN_LEFT_P2
            this.turn_right_key = ControlKey.TURN_RIGHT_P2
            this.shoot_rope_key = ControlKey.SHOOT_ROPE_P2
            this.release_rope_key = ControlKey.RELEASE_ROPE_P2
        }
    }

    onUpdate(delta: number, absolute: number) {
        let rotateSpeed = ROTATE_COEFFICIENT * delta
        let playerMatter = this.player.playerMatter

        if (this.keyInputsComp.isKeyPressed(this.turn_left_key)) {
            Matter.Body.rotate(playerMatter.body, rotateSpeed)
        } else if (this.keyInputsComp.isKeyPressed(this.turn_right_key)) {
            Matter.Body.rotate(playerMatter.body, -(rotateSpeed))
        }

        // work with rope
        if (this.keyInputsComp.isKeyPressed(this.release_rope_key)) {
            if (this.ropeMatter) {
                this.releaseRope(playerMatter);
            }
        } else if (this.keyInputsComp.isKeyPressed(this.shoot_rope_key)) {
            if (this.ropeMatter) {
                this.ropeMovement(delta)
            }
            else {
              //  this.rope = new Rope(this.binder, this.player)
              this.createRope(playerMatter)
            }
        }

        if (this.ropeMatter && this.ropeMatter.body.isStatic == false) {
            Matter.Events.on(this.binder.mEngine, 'collisionStart', (event: any) => {
                this.ropeCreateConstraint(event);
            });
        }
        else if (this.ropeMatter && this.ropeMatter.body.isStatic == true) {
            this.ropeShorterLength(playerMatter)
        }
    }

    private releaseRope(playerMatter: PixiMatter.MatterBody) {
        // předám rychlost
        if (this.ropeMatter.body.isStatic == true) {
            let playerSpeed = this.player.speed
            Matter.Body.setVelocity(playerMatter.body, {
                x: (playerSpeed) * Math.cos(this.releasedRopeAngle),
                y: (playerSpeed) * Math.sin(this.releasedRopeAngle)
            })
            Matter.World.remove(this.binder.mWorld, this.ropeConstraint.constraint)
            this.ropeConstraint.destroy()
            this.ropeConstraint = null
        }
        // remove constraint and ropeEnd
        Matter.World.remove(this.binder.mWorld, this.ropeMatter.body)
        this.ropeMatter.destroy()
        this.ropeMatter = null
    }

    // rope speed is actualized here (with delta)
    private ropeMovement(delta: number) {
        let playerSpeed = this.player.speed
        // rope shorten length
        if (this.ropeConstraint) {
            this.player.speed = playerSpeed + (this.ropeSpeedIncrease * delta)
        }
        // rope end set movement
        else {
            let newSpeed = playerSpeed + (this.ropeSpeedIncrease * delta)
            Matter.Body.setVelocity(this.ropeMatter.body,
                {
                    x: (newSpeed) * Math.cos(this.releasedRopeAngle),
                    y: (newSpeed) * Math.sin(this.releasedRopeAngle)
                }
            )
            this.player.speed = newSpeed
        }
    }

    private ropeShorterLength(playerMatter: PixiMatter.MatterBody) {
        let ropeLength = this.ropeConstraint.constraint.length - this.player.speed
        if (ropeLength > PLAYER_HEIGHT) {
            this.ropeConstraint.constraint.length = ropeLength
        }
        else {
            this.releaseRope(playerMatter)
        }
    }

    // name: String, pairs : any,  source : any
    private ropeCreateConstraint = (event: any) => {
        let pairs = event.pairs;
        for (let pair of pairs) {
            let ropeCollision = (pair.bodyA.label == this.ropeLabel || pair.bodyB.label == this.ropeLabel)
            // only players components have labels
            if (ropeCollision == true) {
                // TODO: nesmí se chytit za soupeře (second label nebude mít P něco id, nebo  rope)

                let secondPoint = (pair.bodyA.label == this.ropeLabel) ? pair.bodyB : pair.bodyA
                Matter.Body.setStatic(this.ropeMatter.body, true);

                this.player.speed = INIT_PLAYER_SPEED

                // rope constraint
                if (this.ropeConstraint == null) {
                    this.ropeConstraint = this.binder.addConstraint(Matter.Constraint.create({
                        bodyA: this.ropeMatter.body,
                        bodyB: this.player.playerMatter.body,
                        type: 'pin'
                    })) as PixiMatter.MatterConstraint
                }
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
        }
    }

    // method to fire the rope
    createRope(playerMatter: PixiMatter.MatterBody) {
        let angle = playerMatter.body.angle
        let rope = this.binder.addBody(Matter.Bodies.rectangle(playerMatter.position.x + (1.5 * PLAYER_HEIGHT) * Math.cos(angle), playerMatter.y + (1.5 * PLAYER_HEIGHT) * Math.sin(angle), 10, 10,
            {
                frictionAir: 0
            })) as PixiMatter.MatterBody

        // set rope
        this.ropeMatter = rope
        this.releasedRopeAngle = angle
        this.ropeMatter.body.label = this.ropeLabel
    }

}

