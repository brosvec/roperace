import * as Matter from "matter-js";
import * as PixiMatter from '../../libs/pixi-matter';
import { BORDER_SIZE, GAME_WIDTH, BUTTON_HEIGHT, GAME_HEIGHT,ROTATE_COEFFICIENT, MoveShapes, Obstacles, PLAYER_HEIGHT, GAME_PANEL_HEIGHT, FINISH_LABEL, Assets, P1_LIVES_TEXT, P2_LIVES_TEXT, Players_id, LEVEL_NUMBER_TEXT, LEVEL_TIME_TEXT } from "../utils/constants";
import * as ECS from '../../libs/pixi-ecs';
import { PlayerController } from "../Components/playerController";
import { GamePanelComponent } from "../Components/gamePanelComponent";
import { Player } from "../Model/player";
import { Obstacle } from "../Model/obstacle";
import { ObstacleFactory  } from "./obstacleFactory";
import { PowerUpFactory  } from "./powerUpFactory";
import * as PIXI from 'pixi.js';
import { WanderComponent } from '../Components/steeringComponent';
import { MoveInCircleComponent } from '../Components/moveInCircleComponent';
import {UtilFunctions} from '../Utils/utilFunctions';




// todo: fill whole screen and resize with screen
// todo: send gameOptions to createMap

export class LevelFactory {
    private scene: ECS.Scene
    private binder: PixiMatter.MatterBind
    private obstacleFactory : ObstacleFactory
    private powerUpFactory : PowerUpFactory

    constructor(scene: ECS.Scene, binder: PixiMatter.MatterBind) {
        this.scene = scene
        this.binder = binder
        this.obstacleFactory = new ObstacleFactory(scene,binder)
        this.powerUpFactory = new PowerUpFactory(scene,binder)
    }


    private createWalls(binder: PixiMatter.MatterBind, screenWidth: number, screenHeight: number): void {
        // walls
        this.obstacleFactory.createWallObstacle(Matter.Bodies.rectangle(screenWidth, screenHeight / 2, BORDER_SIZE, screenHeight, { isStatic: true }))
        this.obstacleFactory.createWallObstacle(Matter.Bodies.rectangle(screenWidth, screenHeight / 2, BORDER_SIZE, screenHeight, { isStatic: true }))
        this.obstacleFactory.createWallObstacle(Matter.Bodies.rectangle(0, screenHeight / 2, BORDER_SIZE, screenHeight, { isStatic: true }))
        this.obstacleFactory.createWallObstacle(Matter.Bodies.rectangle(screenWidth / 2, screenHeight, screenWidth, BORDER_SIZE, { isStatic: true }))
    }
    private setObjectMoveAble(body : PixiMatter.MatterBody, moveShape :  MoveShapes){
        // todo: moveable Obstacle
        switch (moveShape) {
            case MoveShapes.CIRCLE:
                body.addComponent(new MoveInCircleComponent(ROTATE_COEFFICIENT))
                break;
            default:
                // todo: wander?
        }
    }

    public createLevel(levelNumber: number, binder: PixiMatter.MatterBind, screenWidth: number, screenHeight: number, numberOfPlayers: number): void {
        this.createInfoPanel(binder, screenWidth, screenHeight, numberOfPlayers, levelNumber)
        this.createWalls(binder, screenWidth, screenHeight)
        switch (levelNumber) {
            case 1: {
                this.createLevel1(binder)
                break;
            }
            default: {
                break;
            }
        }
    }

    private createLevel1(binder: PixiMatter.MatterBind): void {
       this.obstacleFactory.createWallObstacle(Matter.Bodies.rectangle(300, 225, 700, 20, { isStatic: true, angle: Math.PI * 0.06}))

       this.obstacleFactory.createWallObstacle(Matter.Bodies.rectangle(300, 350, 700, 20, { isStatic: true, angle: Math.PI * 0.06 }))
        this.obstacleFactory.createWallObstacle(Matter.Bodies.rectangle(300, 520, 700, 20, { isStatic: true, angle: Math.PI * 0.06 }))

        let obstacle =  this.obstacleFactory.createWallObstacle(Matter.Bodies.rectangle(250, 110, BORDER_SIZE, 80, { isStatic: false }))
        this.setObjectMoveAble(obstacle, MoveShapes.CIRCLE)

        // 200,400
        this.createFinish(new ECS.Vector(100, 100))

        this.powerUpFactory.generateRandomPowerUps(20);
    }

    private createFinish(position: ECS.Vector) {
        let finish = this.binder.addBody(Matter.Bodies.rectangle(position.x, position.y, 20, 25, {
            isStatic: true,
            label: FINISH_LABEL
        }))
    }

    private getLevelSpawnArea(levelNumber: number): ECS.Vector {
        switch (levelNumber) {
            default: {
                return new ECS.Vector(40, 40)
            }
        }
    }



    public createPlayers(binder: PixiMatter.MatterBind, levelNumber: number, numberOfPlayers: number, screenWidth: number) {
        let startVector = this.getLevelSpawnArea(levelNumber)
        let startPositionY = startVector.y
        let startPositionX = startVector.x

        let players: Array<Player> = new Array()
        // Create two boxes and a ground
        for (let i = 1; i <= numberOfPlayers; i++) {
            players.push(this.createPlayer(i, startPositionX, startPositionY))
        }
        return players;
    }

    private createPlayer(playerNumber: number, startPositionX: number, startPositionY: number): Player {
        let player = new Player(playerNumber)
        let playerBody = this.binder.addBody(Matter.Bodies.rectangle(startPositionX, startPositionY + playerNumber * PLAYER_HEIGHT, PLAYER_HEIGHT, PLAYER_HEIGHT, {
            frictionAir: 0,
            restitution: 0.5,
            //   render: {
                  //visible: true,
                  // strokeStyle: ,
             /*     sprite: {
                       texture : '',
                       xScale : 1,
                       yScale: 1} // new ECS.Sprite("bla",PIXI.Texture.from(Assets.P1_AVATAR))
               } */
        }
        ))
        playerBody.addComponent(new PlayerController(this.binder, player))
        player.playerMatter = playerBody as PixiMatter.MatterBody
        player.playerMatter.body.label = player.id

        let textureStartPosition = UtilFunctions.getTexturePosition(playerBody.position, PLAYER_HEIGHT, PLAYER_HEIGHT)
        let picture = PIXI.Texture.from(Assets.P1_AVATAR)
        let playerObj = new ECS.Builder(this.scene)
            .asSprite(picture)
            .localPos(textureStartPosition.x, textureStartPosition.y)
            .withParent(playerBody)
            .build();
        playerObj.width = PLAYER_HEIGHT
        playerObj.height = PLAYER_HEIGHT

        return player
    }

    public createInfoPanel(binder: PixiMatter.MatterBind, screenWidth: number, screenHeight: number, numberOfPlayers: number, levelNumber: number): void {

        const style = new PIXI.TextStyle({
            fontFamily: 'Arial',
            fontSize: 20,
            fill: '#FF5733',
            // stroke: '#FF5733',
            strokeThickness: 5
        });

        let gameInfoPanel = binder.addBody(Matter.Bodies.rectangle(screenWidth / 2, 0, screenWidth, GAME_PANEL_HEIGHT, { isStatic: true }))
        let gapSpace = 10
        let panel = new ECS.Builder(this.scene)
            .localPos(0, 0)
            .withComponent(new GamePanelComponent())
            .withParent(this.scene.stage)
            .asContainer()
            .build();


        for (let i = 1; i <= numberOfPlayers; i++) {
            let textName = (i == 1) ? P1_LIVES_TEXT : P2_LIVES_TEXT
            let startPositionX = (i == 1) ? 10 : 200
            let width = new ECS.Builder(this.scene)
                .localPos(startPositionX, 0)
                .withParent(panel)
                .asText("Player " + i + ":", style)
                .build().width

            new ECS.Builder(this.scene)
                .localPos(startPositionX + width + gapSpace, 0)
                .withParent(panel)
                .asText("100 %", style)
                .withName(textName)
                .build()
        }

        let levelNumberStartPositionx = GAME_WIDTH - 350
        let levelNumberTextWidth = new ECS.Builder(this.scene)
            .localPos(levelNumberStartPositionx, 0)
            .withParent(panel)
            .asText("Level number :", style)
            .build().width

        new ECS.Builder(this.scene)
            .localPos(levelNumberStartPositionx + levelNumberTextWidth + gapSpace, 0)
            .withParent(panel)
            .asText(levelNumber.toString(), style)
            .withName(LEVEL_NUMBER_TEXT)
            .build()

        let timeStartPositionx = GAME_WIDTH - 150
        let timeTextWidth = new ECS.Builder(this.scene)
            .localPos(timeStartPositionx, 0)
            .withParent(panel)
            .asText("Time :", style)
            .build().width

        new ECS.Builder(this.scene)
            .localPos(timeStartPositionx + timeTextWidth + gapSpace, 0)
            .withParent(panel)
            .asText("0", style)
            .withName(LEVEL_TIME_TEXT)
            .build()


        let resetBtn = PIXI.Texture.from(Assets.RESET_BTN)
        let resetBtnObj = new ECS.Builder(this.scene)
            .asSprite(resetBtn)
            .localPos(GAME_WIDTH - 50, GAME_PANEL_HEIGHT / 2 + gapSpace)
            .withParent(panel)
            .build();
        resetBtnObj.width = BUTTON_HEIGHT
        resetBtnObj.height = BUTTON_HEIGHT
        resetBtnObj.interactive = true
        resetBtnObj.buttonMode = true;
        resetBtnObj.on('pointerdown', () => {
            location.reload()
        });

        let menuBtn = PIXI.Texture.from(Assets.P1_AVATAR)
        let menuBtnObj = new ECS.Builder(this.scene)
            .asSprite(menuBtn)
            .localPos(resetBtnObj.position.x, resetBtnObj.position.y + gapSpace + BUTTON_HEIGHT)
            .withParent(panel)
            .build();
        menuBtnObj.width = BUTTON_HEIGHT
        menuBtnObj.height = BUTTON_HEIGHT
        menuBtnObj.interactive = true
        menuBtnObj.buttonMode = true;
        menuBtnObj.on('pointerdown', () => {
            this.showMenu(panel)
        });
    }
    private showMenu(panel: ECS.Container) {
        const style = new PIXI.TextStyle({
            fontFamily: 'Arial',
            fontSize: 20,
            fill: '#FF5733',
            // stroke: '#FF5733',
            strokeThickness: 5
        });
        //todo:  poskládat ze spritů - podle toho na který se klikne, tak se nastaví hodnota level, nebo počet hráčů



        let levelNumberTextWidth = new ECS.Builder(this.scene)
            .localPos(400, 150)
            .withParent(panel)
            .asText("Level:", style)
            .build().width

        let selectedLevel = new ECS.Builder(this.scene)
            .localPos(400 + levelNumberTextWidth + 10, 150)
            .withParent(panel)
            .asText("1", style)
            .withName("MENU_LEVEL")
            .build()

        let players = new ECS.Builder(this.scene)
            .localPos(380, 200)
            .withParent(panel)
            .asText("Players:", style)
            .build()

        let selectedPlayer = new ECS.Builder(this.scene)
            .localPos(400 + levelNumberTextWidth + 10, 200)
            .withParent(panel)
            .asText("2", style)
            .withName("MENU_PLAYERS")
            .build()


        let playBtn = PIXI.Texture.from(Assets.P1_AVATAR)
        let playBtnObj = new ECS.Builder(this.scene)
            .asSprite(playBtn)
            .localPos(400, selectedLevel.position.y + 100 + BUTTON_HEIGHT)
            .withParent(panel)
            .build();
        playBtnObj.width = BUTTON_HEIGHT
        playBtnObj.height = BUTTON_HEIGHT
        playBtnObj.interactive = true
        playBtnObj.buttonMode = true
        playBtnObj.on('pointerdown', () => {
            // load game with new parameters
            const level: ECS.Text = this.scene.findObjectByName("MENU_LEVEL") as ECS.Text;
            const players: ECS.Text = this.scene.findObjectByName("MENU_LEVEL") as ECS.Text;
            let levelNumb = +level.text
            let playersNumb = +players.text;

            let url = new URL(location.href, location.origin)
            url.searchParams.set('level', '1');
            url.searchParams.set('players', '2');
            location.href = url.href;
        });

    }
}

// this will create a new instance as soon as this file is loaded
//export {CreateMap};
