import { Engine, Render, Bodies, World } from "matter-js";
import * as PixiMatter from '../../libs/pixi-matter';
import { BORDER_SIZE, GAME_WIDTH, BUTTON_HEIGHT, GAME_HEIGHT, PLAYER_HEIGHT, GAME_PANEL_HEIGHT, FINISH_LABEL, Assets, P1_LIVES_TEXT, P2_LIVES_TEXT, Players_id, LEVEL_NUMBER_TEXT, LEVEL_TIME_TEXT } from "../utils/constants";
import * as ECS from '../../libs/pixi-ecs';
import { PlayerController } from "../Components/playerController";
import { GamePanelComponent } from "../Components/gamePanelComponent";
import { Player } from "../Model/player";
import * as PIXI from 'pixi.js';



// todo: fill whole screen and resize with screen
// todo: send gameOptions to createMap

export class LevelFactory {
    private scene: ECS.Scene
    constructor(scene: ECS.Scene) {
        this.scene = scene
    }


    private createWalls(binder: PixiMatter.MatterBind, screenWidth: number, screenHeight: number): void {
        // walls
        binder.addBody(Bodies.rectangle(screenWidth, screenHeight / 2, BORDER_SIZE, screenHeight, { isStatic: true }))
        binder.addBody(Bodies.rectangle(0, screenHeight / 2, BORDER_SIZE, screenHeight, { isStatic: true }))
        binder.addBody(Bodies.rectangle(screenWidth / 2, screenHeight, screenWidth, BORDER_SIZE, { isStatic: true }))
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
        binder.addBody(Bodies.rectangle(300, 180, 700, 20, { isStatic: true, angle: Math.PI * 0.06 }))
        binder.addBody(Bodies.rectangle(300, 350, 700, 20, { isStatic: true, angle: Math.PI * 0.06 }))
        binder.addBody(Bodies.rectangle(300, 520, 700, 20, { isStatic: true, angle: Math.PI * 0.06 }))

        // 200,400
        this.createFinish(new ECS.Vector(100, 100), binder)
    }

    private createFinish(position: ECS.Vector, binder: PixiMatter.MatterBind) {
        let finish = binder.addBody(Bodies.rectangle(position.x, position.y, 20, 25, {
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

        let playerHeight = PLAYER_HEIGHT
        let players: Array<Player> = new Array()
        // Create two boxes and a ground
        for (let i = 1; i <= numberOfPlayers; i++) {
            let playerBody = binder.addBody(Bodies.rectangle(startPositionX, startPositionY + i * playerHeight, playerHeight, playerHeight, {
                frictionAir: 0,
                restitution: 0.5,
                /*   render: {
                      //visible: true,
                      // strokeStyle: ,
                      sprite: {
                           texture : ,
                           xScale : 1,
                           yScale: 1} // new ECS.Sprite("bla",PIXI.Texture.from(Assets.P1_AVATAR))
                   } */
            }
            ))
            let player = new Player(i)
            playerBody.addComponent(new PlayerController(binder, player))

            player.playerMatter = playerBody as PixiMatter.MatterBody

            player.playerMatter.body.label = player.id
            players.push(player)

            let textureStartPosition = this.getTexturePosition(playerBody.position, playerHeight, playerHeight)
            let picture = PIXI.Texture.from(Assets.P1_AVATAR)
            let playerObj = new ECS.Builder(this.scene)
                .asSprite(picture)
                .localPos(textureStartPosition.x, textureStartPosition.y)
                .withParent(playerBody)
                .build();
            playerObj.width = playerHeight
            playerObj.height = playerHeight
        }
        return players;
    }

    private getTexturePosition(objectCenterPosition: PIXI.ObservablePoint, height: number, width: number): ECS.Vector {
        return new ECS.Vector(objectCenterPosition.x - (width / 2), objectCenterPosition.y - (height / 2))
    }

    public createInfoPanel(binder: PixiMatter.MatterBind, screenWidth: number, screenHeight: number, numberOfPlayers: number, levelNumber: number): void {

        const style = new PIXI.TextStyle({
            fontFamily: 'Arial',
            fontSize: 20,
            fill: '#FF5733',
            // stroke: '#FF5733',
            strokeThickness: 5
        });

        let gameInfoPanel = binder.addBody(Bodies.rectangle(screenWidth / 2, 0, screenWidth, GAME_PANEL_HEIGHT, { isStatic: true }))
        //  gameInfoPanel.addTag("GameInfoContainer")
        let gapSpace = 10
        let panel = new ECS.Builder(this.scene)
            .localPos(0, 0)
            .withComponent(new GamePanelComponent())
            .withParent(this.scene.stage)
            .asContainer()
            .build();
        //  gameInfoPanel.addTag("GameInfoContainer")


        // P1_LIVES_TEXT, P1_NAME_TEXT
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


        let resetBtn = PIXI.Texture.from(Assets.P1_AVATAR)
        let resetBtnObj = new ECS.Builder(this.scene)
            //.asText("RESTART", restartStyle)
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
            //.asText("RESTART", restartStyle)
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
     //   this.showMenu(panel)

        /*
                new ECS.Builder(this.scene)
                .localPos(90, 0)
                .withParent(panel)
                .asText("100 %", style)
                .withName('bla')
                .build()
        */

        /*
                new ECS.Builder(this.scene)
                    .localPos(0, 0)
                    .withParent(gameInfoPanel)
                    .asBitmapText("P1_LIVE", , 7, 0x00000)
                    .build()
        */
        /*     new ECS.Builder(this.scene)
                 .localPos(105, 9)
                 .withParent(container)
                 .asBitmapText(TextContainerType.TIME_MINS, "3", "nes_font_digits", 7, 0xFFFFFF)
                 .build();

             new ECS.Builder(this.scene)
                 .localPos(120, 9)
                 .withParent(container)
                 .asBitmapText(TextContainerType.TIME_SECS, "00", "nes_font_digits", 7, 0xFFFFFF)
                 .build();

             new ECS.Builder(this.scene)
                 .localPos(153, 9)
                 .withParent(container)
                 .asBitmapText(TextContainerType.LIVES, "3", "nes_font_digits", 7, 0xFFFFFF)
                 .build();

             new ECS.Builder(this.scene)
                 .localPos(185, 9)
                 .withParent(container)
                 .asBitmapText(TextContainerType.HISCORE, "00000000", "nes_font_digits", 7, 0xFFFFFF)
                 .build();
                 */
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
        //


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
            //.asText("RESTART", restartStyle)
            .asSprite(playBtn)
            .localPos(400, selectedLevel.position.y + 100 + BUTTON_HEIGHT)
            .withParent(panel)
            .build();
        playBtnObj.width = BUTTON_HEIGHT
        playBtnObj.height = BUTTON_HEIGHT
        playBtnObj.interactive = true
        playBtnObj.buttonMode = true
        playBtnObj.on('pointerdown', () => {
            // TODO: play
            const level: ECS.Text = this.scene.findObjectByName("MENU_LEVEL") as ECS.Text;
            const players: ECS.Text =  this.scene.findObjectByName("MENU_LEVEL") as ECS.Text;
          let levelNumb = +level.text
          let playersNumb = +players.text
          
        });



    }

}

// this will create a new instance as soon as this file is loaded
//export {CreateMap};
