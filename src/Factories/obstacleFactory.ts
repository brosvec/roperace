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
    public createWallObstacle(wall: Matter.Body) : PixiMatter.MatterBody {
        return this.createObstacle(wall,Assets.RESET_BTN,Obstacles.OBSTACLE_WALL)
    }
    private createObstacle(obstacleBody: Matter.Body,asset :Assets,obstacleType :Obstacles) : PixiMatter.MatterBody {
        Matter.Render
        let obstacleContainer = this.binder.addBody(obstacleBody) as PixiMatter.MatterBody


        // todo:
        /*

        obstacleContainer.rotation = obstacleContainer.body.angle
        let a = obstacleContainer.rotation
        let height = obstacleContainer.height
        let width =  obstacleContainer.width

        let textureStartPosition = UtilFunctions.getTexturePosition(obstacleContainer.position, height, width)
        let picture = PIXI.Texture.from(asset)
        let obstacleObj = new ECS.Builder(this.scene)
            .asSprite(picture)
           // .asMesh(picture,obstacleBody.vertices)
            .localPos(textureStartPosition.x, textureStartPosition.y)
            .withParent(obstacleContainer)
            .build();
        obstacleObj.width = width
        obstacleObj.height = height
        */
        obstacleBody.label = obstacleType
        return obstacleContainer
    }

    public createObstacleWithEdges() {
    }

}