import * as ECS from '../libs/pixi-ecs';
import * as PIXI from 'pixi.js';
import {GameLoop} from './Components/gameLoop';
import {GAME_WIDTH,GAME_HEIGHT} from "./utils/constants";
import {LevelFactory} from "./Factories/levelFactory";



class RopeRace {
	engine: ECS.Engine;

	constructor() {
		this.engine = new ECS.Engine();
		let canvas = (document.getElementById('gameCanvas') as HTMLCanvasElement);

		// init the game loop
		this.engine.init(canvas, {
			resizeToScreen: true,
			width: GAME_WIDTH,
			height: GAME_HEIGHT,
			resolution: 1,
			flagsSearchEnabled: false, // searching by flags feature
			statesSearchEnabled: false, // searching by states feature
			tagsSearchEnabled: false, // searching by tags feature
			namesSearchEnabled: true, // searching by names feature
			notifyAttributeChanges: false, // will send message if attributes change
			notifyStateChanges: false, // will send message if states change
			notifyFlagChanges: false, // will send message if flags change
			notifyTagChanges: false, // will send message if tags change
			debugEnabled: true // debugging window
		});


		this.engine.app.loader
			.reset()
			//.add(myFile, 'myFileUrl') load your assets here
			.load(() => this.onAssetsLoaded());
	}

	onAssetsLoaded() {
		// init the scene and run your game
		let scene = this.engine.scene;

		this.engine.scene.addGlobalComponent(new ECS.KeyInputComponent());
		//this.engine.scene.addGlobalComponent(SoundComponent());
		this.engine.scene.addGlobalComponent(new GameLoop());
		//this.engine.scene.addGlobalComponent(gameManager);
	}

}

// this will create a new instance as soon as this file is loaded
export default new RopeRace();