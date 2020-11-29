import * as Matter from "matter-js";
import * as PixiMatter from '../../libs/pixi-matter';
import { BORDER_SIZE, LEVEL_1_POWER_UPS, GAME_WIDTH, BUTTON_HEIGHT,FINISH_HEIGHT, PLAYER_WIDTH, GAME_HEIGHT, ROTATE_COEFFICIENT, MoveShapes, Obstacles, PLAYER_HEIGHT, GAME_PANEL_HEIGHT, FINISH_LABEL, Assets, P1_LIVES_TEXT, P2_LIVES_TEXT, Players_id, LEVEL_NUMBER_TEXT, LEVEL_TIME_TEXT } from "../utils/constants";
import * as ECS from '../../libs/pixi-ecs';
import { PlayerController } from "../Components/playerController";
import { GamePanelComponent } from "../Components/gamePanelComponent";
import { Player } from "../Model/player";
import { Obstacle } from "../Model/obstacle";
import { ObstacleFactory } from "./obstacleFactory";
import { PowerUpFactory } from "./powerUpFactory";
import * as PIXI from 'pixi.js';
import { WanderComponent } from '../Components/steeringComponent';
import { MoveInCircleComponent } from '../Components/moveInCircleComponent';
import { UtilFunctions } from '../Utils/utilFunctions';




// todo: fill whole screen and resize with screen
// todo: send gameOptions to createMap

export class LevelFactory {
    private scene: ECS.Scene
    private binder: PixiMatter.MatterBind
    private obstacleFactory: ObstacleFactory
    private powerUpFactory: PowerUpFactory

    constructor(scene: ECS.Scene, binder: PixiMatter.MatterBind) {
        this.scene = scene
        this.binder = binder
        this.obstacleFactory = new ObstacleFactory(scene, binder)
        this.powerUpFactory = new PowerUpFactory(scene, binder)
    }


    private createWalls(binder: PixiMatter.MatterBind, screenWidth: number, screenHeight: number): void {
        // walls
        this.obstacleFactory.createWallObstacle(Matter.Bodies.rectangle(screenWidth, screenHeight / 2, BORDER_SIZE, screenHeight, { isStatic: true }), new ECS.Vector(BORDER_SIZE, screenHeight))
        this.obstacleFactory.createWallObstacle(Matter.Bodies.rectangle(screenWidth, screenHeight / 2, BORDER_SIZE, screenHeight, { isStatic: true }), new ECS.Vector(BORDER_SIZE, screenHeight))
        this.obstacleFactory.createWallObstacle(Matter.Bodies.rectangle(0, screenHeight / 2, BORDER_SIZE, screenHeight, { isStatic: true }), new ECS.Vector(BORDER_SIZE, screenHeight))
        this.obstacleFactory.createWallObstacle(Matter.Bodies.rectangle(screenWidth / 2, screenHeight, screenWidth, BORDER_SIZE, { isStatic: true }), new ECS.Vector(screenWidth, BORDER_SIZE))
    }
    private setObjectMoveAble(body: PixiMatter.MatterBody, moveShape: MoveShapes) {
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
        switch (levelNumber) {
            case 1: {
                this.createLevel1(binder)
                break;
            }
            default: {
                break;
            }
        }
        this.createWalls(binder, screenWidth, screenHeight)
        this.createInfoPanel(binder, screenWidth, screenHeight, numberOfPlayers, levelNumber)
    }
    private createBackground() {
        // background
        let background = PIXI.Texture.from(Assets.BACKGROUND)
        let backgroundObj = new ECS.Builder(this.scene)
            .asSprite(background)
            .localPos(0, 0)
            .withParent(this.scene.stage)
            .build();
        backgroundObj.width = GAME_WIDTH
        backgroundObj.height = GAME_HEIGHT
    }


    private createLevel1(binder: PixiMatter.MatterBind): void {
        this.createBackground()


        let wallVector = new ECS.Vector(700, 20)
        this.obstacleFactory.createWallObstacle(Matter.Bodies.rectangle(300, 225, 700, 20, { isStatic: true, angle: Math.PI * 0.06 }), wallVector)
        this.obstacleFactory.createWallObstacle(Matter.Bodies.rectangle(300, 350, 700, 20, { isStatic: true, angle: Math.PI * 0.06 }), wallVector)
        this.obstacleFactory.createWallObstacle(Matter.Bodies.rectangle(300, 520, 700, 20, { isStatic: true, angle: Math.PI * 0.06 }), wallVector)


        let obstacle = this.obstacleFactory.createWallObstacle(Matter.Bodies.rectangle(250, 110, 20, 80, { isStatic: false }), new ECS.Vector(20, 80))
        this.setObjectMoveAble(obstacle, MoveShapes.CIRCLE)

        // 200,400
        this.createFinish(new ECS.Vector(300, 400))

        this.powerUpFactory.generateRandomPowerUps(LEVEL_1_POWER_UPS);
    }

    private createFinish(position: ECS.Vector) {
        let finish = this.binder.addBody(Matter.Bodies.rectangle(position.x, position.y, FINISH_HEIGHT, FINISH_HEIGHT, {
            isStatic: true,
            label: FINISH_LABEL
        }))
        let obstacleObj = new ECS.Builder(this.scene)
            .asSprite(PIXI.Texture.from(Assets.FINISH))
           .anchor(0.5,0.5)
            .withParent(finish)
            .build();

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
        let playerBody = this.binder.addBody(Matter.Bodies.rectangle(startPositionX, startPositionY + playerNumber * PLAYER_HEIGHT, PLAYER_WIDTH, PLAYER_HEIGHT, {
            frictionAir: 0,
            restitution: 0.5
        }
        ))
        playerBody.addComponent(new PlayerController(this.binder, player))
        player.playerMatter = playerBody as PixiMatter.MatterBody
        player.playerMatter.body.label = player.id

        let textureStartPosition = UtilFunctions.getTexturePosition(playerBody.position, PLAYER_HEIGHT, PLAYER_HEIGHT)
        let textureAsset = (playerNumber == 1) ? Assets.P1_AVATAR : Assets.P2_AVATAR
        let picture = PIXI.Texture.from(textureAsset)
        let playerObj = new ECS.Builder(this.scene)
            .asSprite(picture)
            .localPos(textureStartPosition.x, textureStartPosition.y)
            .withParent(playerBody)
            .build();
        playerObj.width = PLAYER_WIDTH
        playerObj.height = PLAYER_HEIGHT

        return player
    }
    public createSign(asset: Assets, name: string) {
        let signTexture = PIXI.Texture.from(asset)
        return new ECS.Builder(this.scene)
            .asSprite(signTexture)
            .localPos(GAME_WIDTH / 2 - (signTexture.width / 2), GAME_HEIGHT / 2 - (signTexture.height / 2))
            .withParent(this.scene.stage)
            .withName(name)
            .build();
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

        /*
            let gamePanel = PIXI.Texture.from(Assets.GAME_PANEL)
            let gamePanelObj = new ECS.Builder(this.scene)
                .asSprite(gamePanel)
                .localPos(0, 0)
                .withParent(this.scene.stage)
                .build();
        */

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
           // .asBitmapText("Level number :", "JoystixMonospace-Regular", 7, 0xFFFFFF)
           // .asBitmapText("3", "nes_font_digits", 7, 0xFFFFFF)
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

        // buttons
        let resetBtn = PIXI.Texture.from(Assets.RESET_BTN)
        let resetBtnObj = new ECS.Builder(this.scene)
            .asSprite(resetBtn)
            .localPos(GAME_WIDTH - 100, GAME_PANEL_HEIGHT / 2 + gapSpace)
            .withParent(panel)
            .build();
        resetBtnObj.interactive = true
        resetBtnObj.buttonMode = true;
        resetBtnObj.on('pointerdown', () => {
            location.reload()
        });

        let menuBtn = PIXI.Texture.from(Assets.SETTINGS_BTN)
        let menuBtnObj = new ECS.Builder(this.scene)
            .asSprite(menuBtn)
            .localPos(GAME_WIDTH - 60, resetBtnObj.position.y + gapSpace + resetBtnObj.height)
            .withParent(panel)
            .build();
        menuBtnObj.interactive = true
        menuBtnObj.buttonMode = true;
        menuBtnObj.on('pointerdown', () => {
            const menu: ECS.Container = this.scene.findObjectByName("MENU_PANEL") as ECS.Container;
            if (menu == null) {
                this.showMenu(panel)
            }
            else {
                menu.visible = !menu.visible
            }
        });
    }



    private showMenu(panel: ECS.Container) {
        const style = new PIXI.TextStyle({
            fontFamily: 'Arial',
            fontSize: 20,
            fill: '#FF5733',
            // stroke: '#FF5733',
            strokeThickness: 5,
            //   fontStyle:
        });

        let menu = this.createSign(Assets.MENU, "MENU_PANEL")

        // selected numbers
        let selectedLevel = new ECS.Builder(this.scene)
            .localPos(220, 140)
            .withParent(menu)
            .asText("1", style)
            .withName("MENU_LEVEL")
            .build()

        let selectedPlayer = new ECS.Builder(this.scene)
            .localPos(220, 95)
            .withParent(menu)
            .asText("2", style)
            .withName("MENU_PLAYERS")
            .build()



        // MENU buttons
        let playBtn = PIXI.Texture.from(Assets.PLAY_BTN)
        let playBtnObj = new ECS.Builder(this.scene)
            .asSprite(playBtn)
            .localPos((menu.width / 2) - (playBtn.width / 2), (menu.height / 1.5) - (playBtn.height / 2))
            .withParent(menu)
            .build();
        playBtnObj.interactive = true
        playBtnObj.buttonMode = true

        let Plus_level_Btn = PIXI.Texture.from(Assets.ICON_PLUS)
        let Plus_level_BtnObj = new ECS.Builder(this.scene)
            .asSprite(Plus_level_Btn)
            .localPos(335, 140)
            .withParent(menu)
            .build();
        Plus_level_BtnObj.interactive = true
        Plus_level_BtnObj.buttonMode = true

        let Minus_level_Btn = PIXI.Texture.from(Assets.ICON_MINUS)
        let Minus_level_BtnObj = new ECS.Builder(this.scene)
            .asSprite(Minus_level_Btn)
            .localPos(300, 140)
            .withParent(menu)
            .build();
        Minus_level_BtnObj.interactive = true
        Minus_level_BtnObj.buttonMode = true

        let random_level_Btn = PIXI.Texture.from(Assets.ICON_DICE)
        let random_level_BtnObj = new ECS.Builder(this.scene)
            .asSprite(random_level_Btn)
            .localPos(380, 140)
            .withParent(menu)
            .build();
        random_level_BtnObj.interactive = true
        random_level_BtnObj.buttonMode = true

        let Plus_player_Btn = PIXI.Texture.from(Assets.ICON_PLUS)
        let Plus_player_BtnObj = new ECS.Builder(this.scene)
            .asSprite(Plus_player_Btn)
            .localPos(335, 95)
            .withParent(menu)
            .build();
        Plus_player_BtnObj.interactive = true
        Plus_player_BtnObj.buttonMode = true

        let Minus_player_Btn = PIXI.Texture.from(Assets.ICON_MINUS)
        let Minus_player_BtnObj = new ECS.Builder(this.scene)
            .asSprite(Minus_player_Btn)
            .localPos(300, 95)
            .withParent(menu)
            .build();
        Minus_player_BtnObj.interactive = true
        Minus_player_BtnObj.buttonMode = true



        let maxLevel = 3
        let maxPlayers = 2

        Plus_level_BtnObj.on('pointerdown', () => {
            const level: ECS.Text = this.scene.findObjectByName("MENU_LEVEL") as ECS.Text;
            let newLevelNumb = (+level.text) + 1
            if (maxLevel >= newLevelNumb) {
                level.text = (newLevelNumb).toString()
            }
        })

        Minus_level_BtnObj.on('pointerdown', () => {
            const level: ECS.Text = this.scene.findObjectByName("MENU_LEVEL") as ECS.Text;
            let newLevelNumb = (+level.text) - 1
            if (1 <= newLevelNumb) {
                level.text = (newLevelNumb).toString()
            }
        })

        random_level_BtnObj.on('pointerdown', () => {

        })

        Plus_player_BtnObj.on('pointerdown', () => {
            const players: ECS.Text = this.scene.findObjectByName("MENU_PLAYERS") as ECS.Text;
            let newplayerNumb = (+players.text) + 1
            if (maxPlayers >= newplayerNumb) {
                players.text = (newplayerNumb).toString()
            }
        })

        Minus_player_BtnObj.on('pointerdown', () => {
            const players: ECS.Text = this.scene.findObjectByName("MENU_PLAYERS") as ECS.Text;
            let newplayerNumb = (+players.text) - 1
            if (1 <= newplayerNumb) {
                players.text = (newplayerNumb).toString()
            }
        })


        playBtnObj.on('pointerdown', () => {
            // load game with new parameters
            const level: ECS.Text = this.scene.findObjectByName("MENU_LEVEL") as ECS.Text;
            const players: ECS.Text = this.scene.findObjectByName("MENU_PLAYERS") as ECS.Text;
            let levelNumb = +level.text
            let playersNumb = +players.text;

            let url = new URL(location.href, location.origin)
            url.searchParams.set('level', level.text);
            url.searchParams.set('players', players.text);
            location.href = url.href;
        });
    }
}

// this will create a new instance as soon as this file is loaded
//export {CreateMap};
