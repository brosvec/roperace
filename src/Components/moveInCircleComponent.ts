import * as Matter from "matter-js";
import * as ECS from '../../libs/pixi-ecs';
import * as PixiMatter from '../../libs/pixi-matter';
import { ROTATE_COEFFICIENT } from '../Utils/constants';


export class MoveInCircleComponent extends ECS.Component {
    private coefficient: number
    private position: ECS.Vector
    constructor(coefficient: number) {
        super()
        this.coefficient = coefficient
    }

    onInit() {
        const ownerMatter = this.owner as PixiMatter.MatterBody
        this.position = new ECS.Vector(ownerMatter.body.position.x, ownerMatter.body.position.y)
    }
    onUpdate(delta: number, absolute: number) {
        let rotateSpeed = this.coefficient * delta
        const ownerMatter = this.owner as PixiMatter.MatterBody
        Matter.Body.rotate(ownerMatter.body, rotateSpeed)
        Matter.Body.setPosition(ownerMatter.body, {
            x: this.position.x,
            y: this.position.y
        })
    }
}