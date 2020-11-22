import { INIT_PLAYER_LIVE, INIT_PLAYER_SPEED, PLAYER_HEIGHT } from "../utils/constants";
import * as PixiMatter from '../../libs/pixi-matter';
import * as Matter from "matter-js";
import { Player } from "../Model/player";



export class Rope {
    public releasedRopeAngle: number
    public ropeMatter: PixiMatter.MatterBody
    public ropeLabel: string

    private ownerPlayer : Player
    private binder: PixiMatter.MatterBind


    constructor(binder : PixiMatter.MatterBind,player: Player){
            this.binder = binder
            this.ownerPlayer = player
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

}
