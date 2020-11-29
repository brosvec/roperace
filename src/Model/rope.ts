import { INIT_PLAYER_LIVE, INIT_PLAYER_SPEED, PLAYER_HEIGHT, P1_ROPE, P2_ROPE, ROPE_END_HEIGHT, PLAYER_WIDTH, ROPE_OPTIONS } from "../utils/constants";
import * as PixiMatter from '../../libs/pixi-matter';
import * as Matter from "matter-js";
import { Player } from "../Model/player";
import * as ECS from '../../libs/pixi-ecs';



export class Rope {
    public releasedRopeAngle: number
    public ropeMatter: PixiMatter.MatterBody
    public ropeLabel: string

    private binder: PixiMatter.MatterBind
    private ropeString: PixiMatter.MatterConstraint
    private ropeEndConstraint: PixiMatter.MatterConstraint
    private chain: Matter.Composite


    constructor(binder: PixiMatter.MatterBind, player: Player) {
        this.binder = binder
        if (player.playerNumber == 1) {
            this.ropeLabel = P1_ROPE
        }
        else {
            this.ropeLabel = P2_ROPE
        }

        this.createRope(player.playerMatter)
    }
    createRope(playerMatter: PixiMatter.MatterBody) {
        let angle = playerMatter.body.angle


        let ropeEnd = this.binder.addBody(Matter.Bodies.rectangle(playerMatter.position.x + (1.5 * PLAYER_HEIGHT) * Math.cos(angle),
            playerMatter.y + (1.5 * PLAYER_HEIGHT) * Math.sin(angle), ROPE_END_HEIGHT, ROPE_END_HEIGHT,
            {
                frictionAir: 0
            })) as PixiMatter.MatterBody

        // constraint
        let constraint = Matter.Constraint.create({
            bodyA: ropeEnd.body,
            bodyB: playerMatter.body,
            stiffness: 0.000000000000000000000000000000000000000000000001
        })

        // createROPE STRING
        this.ropeString = this.binder.addConstraint(constraint) as PixiMatter.MatterConstraint
        this.ropeString.options = ROPE_OPTIONS




        // set rope
        this.ropeMatter = ropeEnd
        this.releasedRopeAngle = angle
        this.ropeMatter.body.label = this.ropeLabel
    }

    public destroyRope() {
        Matter.World.remove(this.binder.mWorld, this.ropeMatter.body)
        this.ropeMatter.destroy()
        this.ropeMatter = null
        if (this.ropeEndConstraint != null) {
            Matter.World.remove(this.binder.mWorld, this.ropeEndConstraint.constraint)
            this.ropeEndConstraint.destroy()
            this.ropeEndConstraint = null
        }
        this.destroyRopeString()
    }
    private destroyRopeString() {
        Matter.World.remove(this.binder.mWorld, this.ropeString.constraint)
        this.ropeString.destroy()
        this.ropeString = null
    }

    public ropeStringExists(): boolean {
        return !(this.ropeString == null) && this.isRopeEndHooked()
    }
    public isRopeEndHooked(): boolean {
        // return this.ropeMatter.body.isStatic;
        return !(this.ropeEndConstraint == null)
    }
    public getRopeLength(): number {
        return this.ropeString.constraint.length
    }
    public setRopeLength(ropeLength: number): void {
        this.ropeString.constraint.length = ropeLength
    }

    public ropeEndcollission(player: Player, collisionPossition: ECS.Vector, secondPoint: any) {
        let ropeMatter = this.ropeMatter
        let ropeConstraint = this.ropeString

        let constraint = Matter.Constraint.create({
            bodyA: ropeMatter.body,
            bodyB: secondPoint,
            pointB: { x: collisionPossition.x, y: collisionPossition.y },
            pointA: { x: 0, y: 0 },
            type: 'pin',
            //   stiffness: 0.2,
            length: ROPE_END_HEIGHT / 2
        })
        this.ropeEndConstraint = this.binder.addConstraint(constraint) as PixiMatter.MatterConstraint

        player.speed = INIT_PLAYER_SPEED

        // createRopeString
        this.recreateRopeConstraint(player)

    }

    recreateRopeConstraint(player: Player) {
        Matter.World.remove(this.binder.mWorld, this.ropeString.constraint)
        this.ropeString.destroy()

        // createROPE STRING
        this.ropeString = this.binder.addConstraint(Matter.Constraint.create({
            bodyA: this.ropeMatter.body,
            bodyB: player.playerMatter.body,
            type: 'pin'
        })) as PixiMatter.MatterConstraint
        this.ropeString.options = ROPE_OPTIONS

    }
}
