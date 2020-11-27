import * as Matter from "matter-js";
import * as PixiMatter from '../../libs/pixi-matter';
import * as ECS from '../../libs/pixi-ecs';
import {UtilFunctions} from '../Utils/utilFunctions';
import { BORDER_SIZE, GAME_WIDTH, BUTTON_HEIGHT, GAME_HEIGHT,ROTATE_COEFFICIENT, MoveShapes, Obstacles, PLAYER_HEIGHT, GAME_PANEL_HEIGHT, FINISH_LABEL, Assets, P1_LIVES_TEXT, P2_LIVES_TEXT, Players_id, LEVEL_NUMBER_TEXT, LEVEL_TIME_TEXT } from "../utils/constants";


export class ObstacleFactory {
    private scene: ECS.Scene
    private binder: PixiMatter.MatterBind
    constructor(scene: ECS.Scene, binder: PixiMatter.MatterBind) {
        this.scene = scene
        this.binder = binder
    }
    public createWallObstacle(wall: Matter.Body,  spriteSize :ECS.Vector) : PixiMatter.MatterBody {
        return this.createObstacle(wall,Assets.RESET_BTN,Obstacles.OBSTACLE_WALL, spriteSize)
    }
    private createObstacle(obstacleBody: Matter.Body,asset :Assets,obstacleType :Obstacles, spriteSize :ECS.Vector) : PixiMatter.MatterBody {
        let obstacleContainer = this.binder.addBody(obstacleBody) as PixiMatter.MatterBody


       // let textureStartPosition = UtilFunctions.getTexturePosition(obstacleContainer.position, height, width)
       // .localPos(textureStartPosition.x, textureStartPosition.y)
        let picture = PIXI.Texture.from(asset)
        let obstacleObj = new ECS.Builder(this.scene)
            .asSprite(picture)
           .anchor(0.5,0.5)
            .withParent(obstacleContainer)
            .build();
        obstacleObj.width = spriteSize.x
        obstacleObj.height = spriteSize.y
        obstacleObj.rotation = obstacleBody.angle

        obstacleBody.label = obstacleType
        return obstacleContainer
    }

    public createObstacleWithEdges() {
    }

}