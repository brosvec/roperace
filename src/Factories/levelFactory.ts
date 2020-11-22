import { Engine, Render, Bodies, World} from "matter-js";
import * as PixiMatter from '../../libs/pixi-matter';
import {BORDER_SIZE, GAME_WIDTH, GAME_HEIGHT,PLAYER_HEIGHT, FINISH_LABEL, Assets} from "../utils/constants";
import * as ECS from '../../libs/pixi-ecs';
import {PlayerController} from "../Components/playerController";
import {Player} from "../Model/player";



// todo: fill whole screen and resize with screen
// todo: send gameOptions to createMap

export class LevelFactory {
    private scene: ECS.Scene
    constructor(scene : ECS.Scene){
        this.scene = scene
    }


    private createWalls(binder: PixiMatter.MatterBind,screenWidth: number ,screenHeight: number): void {
        // walls
        binder.addBody(Bodies.rectangle(screenWidth/2, 0, screenWidth, BORDER_SIZE, { isStatic: true }) )
        binder.addBody(Bodies.rectangle(screenWidth, screenHeight/2,  BORDER_SIZE, screenHeight, { isStatic: true }))
        binder.addBody(Bodies.rectangle(0, screenHeight/2,  BORDER_SIZE, screenHeight, { isStatic: true }))
        binder.addBody(Bodies.rectangle(screenWidth/2, screenHeight, screenWidth, BORDER_SIZE, { isStatic: true }))
    }

    public createLevel(levelNumber : number, binder: PixiMatter.MatterBind,screenWidth: number ,screenHeight: number): void{
        this.createWalls(binder,screenWidth,screenHeight)
        switch(levelNumber){
            case 1:{
                this.createLevel1(binder)
                break;
            }
            default: {
                break;
             }
        }
    }

    private createLevel1(binder: PixiMatter.MatterBind): void{
        binder.addBody(Bodies.rectangle(300, 180, 700, 20, { isStatic: true, angle: Math.PI * 0.06 }))
        binder.addBody(Bodies.rectangle(300, 350, 700, 20, { isStatic: true, angle: Math.PI * 0.06 }))
        binder.addBody(Bodies.rectangle(300, 520, 700, 20, { isStatic: true, angle: Math.PI * 0.06 }))

        // 200,400
        this.createFinish(new ECS.Vector(100,100),binder)
    }

    private createFinish(position : ECS.Vector,binder: PixiMatter.MatterBind){
        let finish = binder.addBody(Bodies.rectangle(position.x,position.y,20,25,{
            isStatic: true,
            label: FINISH_LABEL
        }))
    }

    private getLevelSpawnArea(levelNumber : number): ECS.Vector{
        switch(levelNumber){
            default:{
                return new ECS.Vector(40, 40)
            }
        }
    }



    public createPlayers(binder: PixiMatter.MatterBind,levelNumber : number,numberOfPlayers: number,screenWidth: number){
       let startVector = this.getLevelSpawnArea(levelNumber)
        let startPositionY = startVector.y
        let startPositionX = startVector.x

        let playerHeight = PLAYER_HEIGHT
        let players: Array<Player> = new Array()
        // Create two boxes and a ground
        for (let i = 1; i <= numberOfPlayers; i++ )
        {
            let playerBody = binder.addBody(Bodies.rectangle(startPositionX, startPositionY + i*playerHeight, playerHeight, playerHeight,{
                frictionAir: 0,
                restitution: 0.5
                }
            ))
            let player = new Player(i)
            playerBody.addComponent(new PlayerController(binder,player))

            player.playerMatter = playerBody as PixiMatter.MatterBody
            players.push(player)


          let picture = PIXI.Texture.from(Assets.P1_AVATAR)

          new ECS.Builder(this.scene)
            .asSprite(picture)
            .localPos(playerBody.position.x,playerBody.position.y)
            .withParent(playerBody)
            .build();
        }
       return players;
    }

}

// this will create a new instance as soon as this file is loaded
//export {CreateMap};
