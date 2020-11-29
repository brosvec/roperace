import * as ECS from '../../libs/pixi-ecs';


export enum ControlKey {
    TURN_LEFT_P1 = ECS.Keys.KEY_A,
    TURN_RIGHT_P1 = ECS.Keys.KEY_S,
    SHOOT_ROPE_P1 = ECS.Keys.KEY_F,
    RELEASE_ROPE_P1 = ECS.Keys.KEY_G,

    TURN_LEFT_P2 = ECS.Keys.KEY_LEFT,
    TURN_RIGHT_P2 = ECS.Keys.KEY_RIGHT,
    SHOOT_ROPE_P2 = ECS.Keys.KEY_K,
    RELEASE_ROPE_P2 = ECS.Keys.KEY_L,
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
    P2_AVATAR = "P2_AVATAR",
    FINISH = "FINISH",
    LEVEL_COMPLETE_SOUND = "LEVEL_COMPLETE_SOUND",
    RESET_BTN = "RESET_BTN",
    SETTINGS_BTN = "SETTINGS_BTN",
    WALL = "WALL",
    BACKGROUND = "BACKGROUND",
    PLAYER_1_WON = "PLAYER_1_WON",
    PLAYER_2_WON = "PLAYER_2_WON",
    GAME_OVER = "GAME_OVER",
    GAME_PANEL = "GAME_PANEL",
    ICON_DICE = "ICON_DICE",
    ICON_PLUS = "ICON_PLUS",
    ICON_MINUS = "ICON_MINUS",
    MENU = "MENU",
    PLAY_BTN = "PLAY_BTN",
    FIRST_AID_PU = "FIRST_AID",
    FASTER_PU = "FASTER_PU",
    SHIELD_PU = "SHIELD_PU",
    SPRING_PU = "SPRING_PU",
    FONT_JOYSTIX = "FONT_JOYSTIX"
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
    POWER_UP_SHIELD = "POWER_UP_SHIELD",
    POWER_UP_FASTER = "POWER_UP_FASTER",
    POWER_UP_BASE = "POWER_UP_"
}

export enum MoveShapes {
    CIRCLE = "CIRCLE",
    WANDER = "WANDER"
}

export const POWER_UP_HEALTH_VALUE = 50
export const POWER_UP_FASTER_COEFFICIENT = 20
export const POWER_UP_FASTER_VALUE = 0.75
export const POWER_UP_LENGTH = 5000



export const FINISH_LABEL = "FINISH_LABEL"

export const INIT_PLAYER_LIVE = 100
export const INIT_PLAYER_SPEED = 1
export const ROPE_SPEED_INCREASE = 0.01

export const GAME_WIDTH = 800
export const GAME_HEIGHT = 600
export const BUTTON_HEIGHT = 30

export const GAME_PANEL_HEIGHT = 90
export const BORDER_SIZE = 50

export const PLAYER_HEIGHT = 20
export const FINISH_HEIGHT = 30
export const PLAYER_WIDTH = 20

export const ROTATE_COEFFICIENT = 0.005

export const LEVEL_1_POWER_UPS = 10

export const ROPE_END_HEIGHT = 10

export const ROPE_OPTIONS = {
    strokeStyle: '0xF0F0F0',
    lineWidth: 1
}

