import * as ECS from '../../libs/pixi-ecs';
import * as PixiMatter from '../../libs/pixi-matter';
import * as Matter from 'matter-js';
import { GAME_WIDTH, GAME_HEIGHT, Players_id, Messages, Assets } from '../utils/constants';
import { LevelFactory } from "../Factories/levelFactory";
import { Player } from "../Model/player";


export class GameLoop extends ECS.Component {
    private numberOfPlayers: number
    private levelNumber: number
    private players: Array<Player>
    private levelFactory: LevelFactory;
    private levelFinished: boolean = false;
    private deathPlayers: number = 0;


    constructor(levelNumber: number, numberOfPlayers: number) {
        super()
        this.levelNumber = levelNumber;
        this.numberOfPlayers = numberOfPlayers
    }


    public onInit() {
        this.subscribe(
            Messages.FINISH_MESSAGE,
            Messages.PLAYER_DEATH
        )

        let scene = this.scene
        const binder = new PixiMatter.MatterBind();
        binder.init(scene, {
            wireframes: false,
            mouseControl: false,
            renderConstraints: true,
            renderAngles: false,
        });
        binder.mWorld.gravity.y = 0;

        let levelFactory = new LevelFactory(scene, binder);
        levelFactory.createLevel(this.levelNumber, binder, scene.width, scene.height, this.numberOfPlayers);
        // most of game loop features in playerController
        this.players = levelFactory.createPlayers(binder, this.levelNumber, this.numberOfPlayers, scene.width)
        this.levelFactory = levelFactory
    }
    onMessage(msg: ECS.Message) {
        super.onMessage(msg)
        if (this.levelFinished == true) {
            return;
        }

        if (msg.action == Messages.FINISH_MESSAGE) {
            this.levelFinished = true
            let player = msg.data as Player
            let asset = (player.playerNumber == 1) ? Assets.PLAYER_1_WON : Assets.PLAYER_2_WON
            this.levelFactory.createSign(asset, "GAME_END_INFO")

        }
        else if (msg.action == Messages.PLAYER_DEATH) {
            this.deathPlayers += 1
            if (this.players.length == this.deathPlayers) {
                this.levelFactory.createSign(Assets.GAME_OVER, "GAME_END_INFO")
            }
        }
    }


}