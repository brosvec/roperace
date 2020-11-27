import { INIT_PLAYER_LIVE, INIT_PLAYER_SPEED, PLAYER_HEIGHT, P1_ROPE, P2_ROPE, ROPE_END_HEIGHT } from "../utils/constants";
import * as PixiMatter from '../../libs/pixi-matter';
import * as Matter from "matter-js";
import { Player } from "../Model/player";
import * as ECS from '../../libs/pixi-ecs';



export class Rope {
    public releasedRopeAngle: number
    public ropeMatter: PixiMatter.MatterBody
    public ropeLabel: string

    private binder: PixiMatter.MatterBind
    private ropeConstraint: PixiMatter.MatterConstraint
    private ropeEndConstraint: PixiMatter.MatterConstraint
    private chain : Matter.Composite


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

        // set rope
        this.ropeMatter = ropeEnd
        this.releasedRopeAngle = angle
        this.ropeMatter.body.label = this.ropeLabel
    }

    // method to fire the rope
    createRopeNEW(playerMatter: PixiMatter.MatterBody) {
        let angle = playerMatter.body.angle
        let startX = playerMatter.position.x + (1.5 * PLAYER_HEIGHT) * Math.cos(angle)
        let startY = playerMatter.y + (1.5 * PLAYER_HEIGHT) * Math.sin(angle)

        let group = Matter.Body.nextGroup(true),
        particleOptions = { friction: 0.001, collisionFilter: { group: group }},
        constraintOptions = { stiffness: 0.1 },
        chain = Matter.Composites.softBody(startX, startY, 10, 1, 1, 5, false, 2, particleOptions, constraintOptions);
        Matter.World.add(this.binder.mWorld,chain)
        let ropeStart = this.binder.addBody(chain.bodies[0]) as PixiMatter.MatterBody
        let ropeEnd = this.binder.addBody(chain.bodies[chain.bodies.length-1]) as PixiMatter.MatterBody

        let constraint = Matter.Constraint.create({
            bodyA: playerMatter.body,
            bodyB: ropeStart.body,
            type: 'pin',
            //   stiffness: 0.2,
            length: PLAYER_HEIGHT / 2
        })
        this.binder.addConstraint(constraint)

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
    }
    public destroyRopeString() {
        Matter.World.remove(this.binder.mWorld, this.ropeConstraint.constraint)
        this.ropeConstraint.destroy()
        this.ropeConstraint = null
    }

    public ropeStringExists(): boolean {
        return !(this.ropeConstraint == null)
    }
    public isRopeEndStatic(): boolean {
        // return this.ropeMatter.body.isStatic;
        return !(this.ropeEndConstraint == null)
    }
    public getRopeLength(): number {
        return this.ropeConstraint.constraint.length
    }
    public setRopeLength(ropeLength: number): void {
        this.ropeConstraint.constraint.length = ropeLength
    }

    public ropeEndcollission(player: Player, collisionPossition: ECS.Vector, secondPoint: any) {
        let ropeMatter = this.ropeMatter
        let ropeConstraint = this.ropeConstraint

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
        if (ropeConstraint == null) {
            this.ropeConstraint = this.binder.addConstraint(Matter.Constraint.create({
                bodyA: ropeMatter.body,
                bodyB: player.playerMatter.body,
                type: 'pin'
            })) as PixiMatter.MatterConstraint
        }
    }

    /*
     // chain example
        let xPos;
        let yPos;
        let ropeC = Matter.Composites.stack(600, 50, 2, 1, 10, 10, (x, y) => {
            xPos= x
            yPos=y
            return Matter.Bodies.rectangle(x - 10, y, 50, 20, <any>{ collisionFilter: { group: group }, chamfer: 5 });
        });
        let a = 1

        Matter.Composites.chain(ropeC, 0.3, 0, -0.3, 0, { stiffness: 1, length: 0 });
        Matter.Composite.add(ropeC, Matter.Constraint.create({
            bodyB: ropeC.bodies[0],
            pointB: { x: -10, y: 0 },
            pointA: { x: ropeC.bodies[0].position.x, y: ropeC.bodies[0].position.y },
            stiffness: 0.5
        }));

        let ropeEnd = ropeC.bodies[ropeC.bodies.length-1]
        // add to composite
        let body2 =Matter.Bodies.rectangle( xPos - 10, yPos, 50, 20, <any>{ collisionFilter: { group: group }, chamfer: 5 })
        let lengthRope = Matter.Composite.add(ropeC,body2)
         ropeC = Matter.Composites.chain(lengthRope, 0.3, 0, -0.3, 0, { stiffness: 1, length: 0 });

        // remove from composite
        Matter.Composite.remove(ropeC, ropeC.bodies[1])
        */

}
