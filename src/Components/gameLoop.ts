import * as ECS from '../../libs/pixi-ecs';
import * as PixiMatter from '../../libs/pixi-matter';
import * as Matter from 'matter-js';
import {GAME_WIDTH,GAME_HEIGHT,Players_id} from '../utils/constants';
import {LevelFactory} from "../Factories/levelFactory";
import { Player } from "../Model/player";


export class GameLoop extends ECS.Component {
    private numberOfPlayers : number
    private levelNumber : number
    private players: Array<Player>

    constructor(levelNumber : number,numberOfPlayers : number){
        super()
        this.levelNumber = levelNumber;
        this.numberOfPlayers = numberOfPlayers
    }


    public onInit(){
        // TODO: things to subscribe..
        let scene = this.scene


        const binder = new PixiMatter.MatterBind();
		binder.init(scene, {
            wireframes: false,
            mouseControl: false,
            renderConstraints : true,
            renderAngles : false,
        });
        binder.mWorld.gravity.y = 0;
/*
		// create renderer
		let render = Matter.Render.create({
            canvas: document.getElementById('gameCanvas') as HTMLCanvasElement,
			engine: binder.mEngine,
			options: {
			//	wireframes: false,
			}
		});
		Matter.Render.run(render);
*/

        let levelFactory = new LevelFactory(scene,binder);
        levelFactory.createLevel(this.levelNumber,binder, scene.width, scene.height, this.numberOfPlayers);
        // most of game loop features in playerController
        this.players = levelFactory.createPlayers(binder,this.levelNumber, this.numberOfPlayers, scene.width)
    }
}