import * as Matter from "matter-js";
import * as PixiMatter from '../../libs/pixi-matter';
import * as ECS from '../../libs/pixi-ecs';
import {PowerUpComponent} from '../Components/powerUpComponent';
import * as AphMath from "../../libs/aph-math";
import { Power_ups, POWER_UP_HEIGHT, Assets, BORDER_SIZE, GAME_WIDTH, GAME_HEIGHT } from "../utils/constants";


export class PowerUpFactory {
    private scene: ECS.Scene
    private binder: PixiMatter.MatterBind
    constructor(scene: ECS.Scene, binder: PixiMatter.MatterBind) {
        this.scene = scene
        this.binder = binder
    }

    public generateRandomPowerUps(count: number) {
        for (let i = 0; i < count; i++) {
            this.generateRandomPowerUp()
        }
    }
    public generateRandomPowerUp() {
        let random = new AphMath.Random(2001)
        // randomType
        let randomNumber = random.uniformInt(1, 4)
        let selectedPowerUp: Power_ups
        let asset: Assets
        switch (randomNumber) {
            case 1:

            // break;
            default:
                selectedPowerUp = Power_ups.POWER_UP_HEALTH
                asset = Assets.HEALTH_POWER_UP
                break;
        }
        let tries = 0
        while (true) {
            tries +=1
            if(tries > 100){
                break;
            }
            let x = random.normal(BORDER_SIZE, GAME_WIDTH - BORDER_SIZE)
            let y = random.normal(BORDER_SIZE, GAME_HEIGHT - BORDER_SIZE)

            let x1 = Matter.Vector.create(x - BORDER_SIZE, y)
            let x2 = Matter.Vector.create(x, y)
            let x3 = Matter.Vector.create(x, y - BORDER_SIZE)
            let x4 = Matter.Vector.create(x, y)
            let vertices = Matter.Vertices.hull([x1, x2, x3, x4])
            let bounds = Matter.Bounds.create(vertices)

            let anyResult = Matter.Query.region(this.binder.mWorld.bodies, bounds)
            if (anyResult.length == 0) {
                this.generatePowerUp(Matter.Bodies.rectangle(x, y, POWER_UP_HEIGHT, POWER_UP_HEIGHT, { isStatic: false })
                    , asset, selectedPowerUp)
                break;
            }
        }
    }

    public generatePowerUp(obstacleBody: Matter.Body, asset: Assets, obstacleType: Power_ups): PixiMatter.MatterBody {
        let obstacleContainer = this.binder.addBody(obstacleBody) as PixiMatter.MatterBody
        obstacleContainer.addComponent(new PowerUpComponent(this.binder))
        obstacleBody.label = obstacleType

        return obstacleContainer
    }


}