import * as ECS from '../libs/pixi-ecs';
import * as PIXI from 'pixi.js';
import {GameLoop} from './Components/gameLoop';
import {GAME_WIDTH,GAME_HEIGHT, Assets} from "./utils/constants";
import {LevelFactory} from "./Factories/levelFactory";
import { SoundComponent } from './Components/soundComponent';



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


		// asset source
		// https://sfx.productioncrate.com/sound-fx-categories.html#_ga=2.164433212.2088872787.1606083568-1021825284.1606083568
		// https://www.soundsnap.com/search/audio/level%20complete/score

		// assets path vůči tomu, kde se to pouští => dávat úplnou cestu
		this.engine.app.loader
			.reset()
			.add(Assets.P1_AVATAR, '../../assets/ghost.png')
			.add(Assets.RESET_BTN, '../../assets/resetBtn.png')
			.add(Assets.HEALTH_POWER_UP, '../../assets/health_powerup.png')
		//	.add(Assets.FINISH, '../assets/ghost.png')
			.add(Assets.LEVEL_COMPLETE_SOUND, '../../assets/level_complete.mp3')
			.load(() => this.onAssetsLoaded());
	}

	onAssetsLoaded() {
		// init the scene and run your game
		let scene = this.engine.scene;

		let url = new URL(location.href,location.origin)
		let levelParam = url.searchParams.get('level');
		let playersParam = url.searchParams.get('players');
		let level = (levelParam) ? +levelParam : 1
		let players = (playersParam) ? +playersParam : 1
		this.engine.scene.addGlobalComponent(new ECS.KeyInputComponent());
		this.engine.scene.addGlobalComponent(new SoundComponent());
		this.engine.scene.addGlobalComponent(new GameLoop(level,players));
		//this.engine.scene.addGlobalComponent(gameManager);
	}

}

// this will create a new instance as soon as this file is loaded
export default new RopeRace();