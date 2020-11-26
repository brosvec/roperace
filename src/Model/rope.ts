import { INIT_PLAYER_LIVE, INIT_PLAYER_SPEED, PLAYER_HEIGHT, P1_ROPE, P2_ROPE } from "../utils/constants";
import * as PixiMatter from '../../libs/pixi-matter';
import * as Matter from "matter-js";
import { Player } from "../Model/player";



export class Rope {
    public releasedRopeAngle: number
    public ropeMatter: PixiMatter.MatterBody
    public ropeLabel: string

    private binder: PixiMatter.MatterBind
    private ropeConstraint: PixiMatter.MatterConstraint


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

    public destroyRope() {
        Matter.World.remove(this.binder.mWorld, this.ropeMatter.body)
        this.ropeMatter.destroy()
        this.ropeMatter = null
    }
    public destroyRopeString(){
        Matter.World.remove(this.binder.mWorld, this.ropeConstraint.constraint)
        this.ropeConstraint.destroy()
        this.ropeConstraint = null
    }

    public ropeStringExists() : boolean {
        return !(this.ropeConstraint == null)
    }
    public isRopeEndStatic() : boolean {
        return this.ropeMatter.body.isStatic;
    }
    public getRopeLength() : number{
       return this.ropeConstraint.constraint.length
    }
    public setRopeLength(ropeLength : number) : void{
        this.ropeConstraint.constraint.length = ropeLength
     }

    public ropeEndcollission(player: Player){
        let ropeMatter = this.ropeMatter
        let ropeConstraint = this.ropeConstraint
        Matter.Body.setStatic(ropeMatter.body, true);
        player.speed = INIT_PLAYER_SPEED

        // createRopeString
        if (ropeConstraint == null) {
            this.ropeConstraint = this.binder.addConstraint(Matter.Constraint.create({
                bodyA: ropeMatter.body,
                bodyB: player.playerMatter.body,
                type: 'pin'
            })) as PixiMatter.MatterConstraint
        }
    }

}
