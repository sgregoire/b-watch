import {Config} from "./Config";
import {BuildStatus} from "bwatch-common";

export abstract class Fetch<C extends Config> {

    constructor(
        private uuid: string,
        private readonly config: C,
        private readonly onResult: (status: BuildStatus) => void) {
    }

    abstract cancel(): void;

}
