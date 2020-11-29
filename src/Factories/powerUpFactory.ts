import * as Matter from "matter-js";
import * as PixiMatter from '../../libs/pixi-matter';
import * as ECS from '../../libs/pixi-ecs';
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
    private randomInteger(min: number , max: number) : number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
      }

    public generateRandomPowerUp() {
        let random = new AphMath.Random(42)
        // randomType
        let randomNumber = this.randomInteger(1, 3)
        let selectedPowerUp: Power_ups
        let asset: Assets
        switch (randomNumber) {
            case 1:
                selectedPowerUp = Power_ups.POWER_UP_HEALTH
                asset = Assets.FIRST_AID_PU
                break;
            case 2:
                selectedPowerUp = Power_ups.POWER_UP_SHIELD
                asset = Assets.SHIELD_PU
                break;
            case 3:
                selectedPowerUp = Power_ups.POWER_UP_FASTER
                asset = Assets.FASTER_PU
                break;
        }
        let tries = 0

        // Add to world
        while (true) {
            tries += 1
            if (tries > 100) {
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
                this.createPowerUp(Matter.Bodies.rectangle(x, y, POWER_UP_HEIGHT, POWER_UP_HEIGHT, { isStatic: false })
                    , asset, selectedPowerUp)
                break;
            }
        }
    }

    private createPowerUp(obstacleBody: Matter.Body, asset: Assets, obstacleType: Power_ups): PixiMatter.MatterBody {
        let obstacleContainer = this.binder.addBody(obstacleBody) as PixiMatter.MatterBody
        // asset
        let picture = PIXI.Texture.from(asset);
        let obstacleObj = new ECS.Builder(this.scene)
            .asSprite(picture)
           .anchor(0.5,0.5)
            .withParent(obstacleContainer)
            .build();

      //  obstacleContainer.addComponent(new PowerUpComponent(this.binder))
        obstacleBody.label = obstacleType

        return obstacleContainer
    }


}