import * as ECS from '../libs/pixi-ecs';

enum Attributes {
	SCENE_STATE = 'SCENE_STATE'
}
interface SceneState {
	isRunning: boolean
}

enum Messages {
	SCENE_PAUSE = 'SCENE_PAUSE',
	SCENE_RESUME = 'SCENE_RESUME',
	CHANGE_DIRECTION = 'CHANGE_DIRECTION',
	CHANGE_COLOR = 'CHANGE_COLOR'
}

enum Direction {
	LEFT = 0, RIGHT = 1, UP = 2, DOWN = 3
}

export class SceneManager extends ECS.Component {

	keyInput: ECS.KeyInputComponent;

	onInit() {
		this.keyInput = this.scene.findGlobalComponentByName(ECS.KeyInputComponent.name);
		// emit 3 objects
	/*	this.emitObject();
		this.emitObject();
		this.emitObject();*/
    }

	onUpdate() {
		if (this.keyInput.isKeyPressed(ECS.Keys.KEY_Q)) {
			this.keyInput.handleKey(ECS.Keys.KEY_Q);
			this.changeDirection();
		}

		if (this.keyInput.isKeyPressed(ECS.Keys.KEY_W)) {
			this.keyInput.handleKey(ECS.Keys.KEY_W);

			const sceneState = this.scene.getGlobalAttribute<SceneState>(Attributes.SCENE_STATE);
			let isRunning: boolean;
			if (sceneState.isRunning) {
				isRunning = false;
				this.pauseScene();
			} else {
				isRunning = true;
				this.resumeScene();
			}

			this.scene.assignGlobalAttribute(Attributes.SCENE_STATE, {
				...sceneState,
				isRunning: isRunning
			});
		}

		if (this.keyInput.isKeyPressed(ECS.Keys.KEY_E)) {
			this.keyInput.handleKey(ECS.Keys.KEY_E);
			this.emitObject();
		}
	}

	emitObject() {
	/*	const newObj = objectEmitter(this.scene);
		this.scene.stage.addChild(newObj);*/
	}

	changeDirection() {
		this.sendMessage(Messages.CHANGE_DIRECTION);
	}

	pauseScene() {
		this.sendMessage(Messages.SCENE_PAUSE);
	}

	resumeScene() {
		this.sendMessage(Messages.SCENE_RESUME);
	}
}