import * as ECS from '../../libs/pixi-ecs';


export enum ControlKey {
    TURN_LEFT_P1 = ECS.Keys.KEY_A,
    TURN_RIGHT_P1 = ECS.Keys.KEY_S,
    SHOOT_ROPE_P1 = ECS.Keys.KEY_F,
    RELEASE_ROPE_P1 = ECS.Keys.KEY_G,

    TURN_LEFT_P2 = ECS.Keys.KEY_LEFT,
    TURN_RIGHT_P2 = ECS.Keys.KEY_RIGHT,
    SHOOT_ROPE_P2 = ECS.Keys.KEY_N,
    RELEASE_ROPE_P2 = ECS.Keys.KEY_M,
}
export enum Players_id {
    P1 = "P1",
    P2 = "P2"
}
export enum Messages {
    FINISH_MESSAGE = "FINISH_MESSAGE",
    PLAYER_DEATH = "PLAYER_DEATH",
    PLAYER_LIVES_CHANGED = "PLAYER_LIVES_CHANGED"
}

export enum Assets {
    P1_AVATAR = "P1_AVATAR",
    FINISH = "FINISH",
    LEVEL_COMPLETE_SOUND = "LEVEL_COMPLETE_SOUND",
    RESET_BTN = "RESET_BTN",
    HEALTH_POWER_UP = "HEALTH_POWER_UP",
}

export const P1_ROPE = "P1_ROPE"
export const P2_ROPE = "P2_ROPE"

export const POWER_UP_HEIGHT = 25

export const P1_LIVES_TEXT = "P1_LIVES_TEXT"
export const P2_LIVES_TEXT = "P2_LIVES_TEXT"
export const LEVEL_NUMBER_TEXT = "LEVEL_NUMBER_TEXT"
export const LEVEL_TIME_TEXT = "LEVEL_TIME_TEXT"

export enum Obstacles {
    OBSTACLE_WALL = "OBSTACLE_WALL",
    OBSTACLE_BASE = "OBSTACLE_"
}

export enum Power_ups {
    POWER_UP_HEALTH = "POWER_UP_HEALTH",
    POWER_UP_BASE = "POWER_UP_"
}

export enum MoveShapes {
    CIRCLE = "CIRCLE",
    WANDER = "WANDER"
}


export const FINISH_LABEL = "FINISH_LABEL"

export const INIT_PLAYER_LIVE = 100
export const INIT_PLAYER_SPEED = 1
export const ROPE_SPEED_INCREASE = 0.01

export const GAME_WIDTH = 800
export const GAME_HEIGHT = 600
export const BUTTON_HEIGHT = 30

export const GAME_PANEL_HEIGHT = 75
export const BORDER_SIZE = 20

export const PLAYER_HEIGHT = 20
export const ROTATE_COEFFICIENT = 0.005

