export type SpinnerName =
	"dots"
	| "dots2"
	| "dots3"
	| "dots4"
	| "dots5"
	| "dots6"
	| "dots7"
	| "dots8"
	| "dots9"
	| "dots10"
	| "dots11"
	| "dots12"
	| "line"
	| "line2"
	| "pipe"
	| "simpleDots"
	| "simpleDotsScrolling"
	| "star"
	| "star2"
	| "flip"
	| "hamburger"
	| "growVertical"
	| "growHorizontal"
	| "balloon"
	| "balloon2"
	| "noise"
	| "bounce"
	| "boxBounce"
	| "boxBounce2"
	| "triangle"
	| "arc"
	| "circle"
	| "squareCorners"
	| "circleQuarters"
	| "circleHalves"
	| "squish"
	| "toggle"
	| "toggle2"
	| "toggle3"
	| "toggle4"
	| "toggle5"
	| "toggle6"
	| "toggle7"
	| "toggle8"
	| "toggle9"
	| "toggle10"
	| "toggle11"
	| "toggle12"
	| "toggle13"
	| "arrow"
	| "arrow2"
	| "arrow3"
	| "bouncingBar"
	| "bouncingBall"
	| "smiley"
	| "monkey"
	| "hearts"
	| "clock"
	| "earth"
	| "moon"
	| "runner"
	| "pong"
	| "shark"
	| "dqpb";
export type Color = "black" | "red" | "green" | "yellow" | "blue" | "magenta" | "cyan" | "white" | "gray";

export interface Spinner {
	interval?: number;
	frames: string[];
}

export interface PersistOptions {
	symbol?: string;
	text?: string;
}

export interface Options {
	text?: string;
	spinner?: SpinnerName | Spinner;
	color?: Color;
	interval?: number;
	stream?: NodeJS.WritableStream;
	enabled?: boolean;
	hideCursor?: boolean;
}

export interface SpinnerMessageBase {
	type: string;
	body?: any;
}

export interface SpinnerCreate extends SpinnerMessageBase {
	type: "Create";
	body: Options | string;
}

export interface SpinnerStart extends SpinnerMessageBase {
	type: "Start";
	body: string;
}

export interface SpinnerStop extends SpinnerMessageBase {
	type: "Stop";
}

export interface SpinnerSucceed extends SpinnerMessageBase {
	type: "Succeed";
	body: string;
}

export interface SpinnerFail extends SpinnerMessageBase {
	type: "Fail";
	body: string;
}

export interface SpinnerInfo extends SpinnerMessageBase {
	type: "Info";
	body: string;
}

export interface SpinnerWarn extends SpinnerMessageBase {
	type: "Warn";
	body: string;
}

export interface SpinnerPersist extends SpinnerMessageBase {
	type: "Persist";
	body?: PersistOptions;
}

export interface SpinnerText extends SpinnerMessageBase{
	type: "Text";
	body: string;
}

export interface SpinnerClear extends SpinnerMessageBase {
	type: "Clear";
}

export interface SpinnerAck extends SpinnerMessageBase {
	type: "Ack";
	body: any;
}

export type SpinnerMessage =
	SpinnerCreate
	| SpinnerStart
	| SpinnerFail
	| SpinnerSucceed
	| SpinnerStop
	| SpinnerInfo
	| SpinnerWarn
	| SpinnerPersist
	| SpinnerClear
	| SpinnerText;

export interface SpinnerMessageSerialized {
	msg: SpinnerMessage;
	spinId: string;
	reqId: string;
}
