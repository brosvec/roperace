import * as ECS from '../libs/pixi-ecs';
import * as PIXI from 'pixi.js';
import { GameLoop } from './Components/gameLoop';
import { GAME_WIDTH, GAME_HEIGHT, Assets } from "./utils/constants";
import { LevelFactory } from "./Factories/levelFactory";
import { SoundComponent } from './Components/soundComponent';



class RopeRace {
	engine: ECS.Engine;

	// TODO:
	//after adding all assets set in matter-body - options.lineWidth : 0,
	// and in matter-constraint  MatterConstraintOptions - lineWidth : 0
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
			.add(Assets.P1_AVATAR, '../../assets/player1.png')
			.add(Assets.P2_AVATAR, '../../assets/player2.png')
			.add(Assets.RESET_BTN, '../../assets/1.1_RESET.png')
			.add(Assets.SETTINGS_BTN, '../../assets/1.1_SETTINGS.png')
			.add(Assets.WALL, '../../assets/wall_2-01.png')
			.add(Assets.BACKGROUND, '../../assets/background.png')
			.add(Assets.GAME_OVER, '../../assets/1.1_game_over.png')
			.add(Assets.PLAYER_1_WON, '../../assets/1.1_PlayerOneWon.png')
			.add(Assets.PLAYER_2_WON, '../../assets/1.1_PlayerTwoWon.png')
			.add(Assets.GAME_PANEL, '../../assets/game_panel.png')
			.add(Assets.ICON_DICE, '../../assets/dice.png')
			.add(Assets.ICON_MINUS, '../../assets/Menu_difference.png')
			.add(Assets.ICON_PLUS, '../../assets/Menu_Plus.png')
			.add(Assets.MENU, '../../assets/Menu.png')
			.add(Assets.PLAY_BTN, '../../assets/play_btn1.png')
			/*  TODO: CHANGE fonts */
			//	.add(Assets.FONT_JOYSTIX, '../../assets/joystix_monospace.ttf')
			//.add('../../assets/nes_font_digits.fnt')
			.add(Assets.FIRST_AID_PU, '../../assets/0_FirstAidKit.png')
			.add(Assets.FINISH, '../../assets/finnish_flag.png')
			.add(Assets.SHIELD_PU, '../../assets/0_SHIELD.png')
			.add(Assets.FASTER_PU, '../../assets/0_FASTER.png')
			.add(Assets.SPRING_PU, '../../assets/0_SPRING.png')
			.add(Assets.LEVEL_COMPLETE_SOUND, '../../assets/level_complete.mp3')
			.load(() => this.onAssetsLoaded());
	}

	onAssetsLoaded() {
		// init the scene and run your game
		let scene = this.engine.scene;

		let url = new URL(location.href, location.origin)
		let levelParam = url.searchParams.get('level');
		let playersParam = url.searchParams.get('players');
		let level = (levelParam) ? +levelParam : 1
		let players = (playersParam) ? +playersParam : 1
		this.engine.scene.addGlobalComponent(new ECS.KeyInputComponent());
		this.engine.scene.addGlobalComponent(new SoundComponent());
		this.engine.scene.addGlobalComponent(new GameLoop(level, players));
		//this.engine.scene.addGlobalComponent(gameManager);
	}

}

// this will create a new instance as soon as this file is loaded
export default new RopeRace();