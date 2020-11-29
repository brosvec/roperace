import {Power_ups}from "../utils/constants";
export class PowerUp {
    public damage : number

    public static getPowerUp(power_up_type : Power_ups) {
        switch (power_up_type) {
            case Power_ups.POWER_UP_HEALTH:

            default:
                break;
        }
    }
}