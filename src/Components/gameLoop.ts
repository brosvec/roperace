import * as ECS from '../../libs/pixi-ecs';
import * as PixiMatter from '../../libs/pixi-matter';
import * as Matter from 'matter-js';
import {GAME_WIDTH,GAME_HEIGHT} from '../utils/constants';
import {LevelFactory} from "../Factories/levelFactory";


export class GameLoop extends ECS.Component {
    private numberOfPlayers : number = 1
    private levelNumber : number = 1



    public onInit(){
        // TODO: things to subscribe..
        let scene = this.scene

        const binder = new PixiMatter.MatterBind();
		binder.init(scene, {
            mouseControl: false,
            renderConstraints : true,
            renderAngles : false,
        });
        binder.mWorld.gravity.y = 0;
        scene.addGlobalComponent(new ECS.KeyInputComponent());

		let levelFactory = new LevelFactory(scene);
        levelFactory.createLevel(this.levelNumber,binder, scene.width, scene.height)
        levelFactory.createPlayers(binder,this.levelNumber, this.numberOfPlayers, scene.width)
    }
}