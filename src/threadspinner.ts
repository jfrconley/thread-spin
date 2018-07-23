import child_process = require("child_process");
import {Options, PersistOptions, SpinnerMessage, SpinnerPersist} from "./types";
import {join} from "path";
const hyperid = require("hyperid");

export class ThreadSpinner {
	public static shutdown() {
		if (ThreadSpinner.renderThread != null) {
			ThreadSpinner.renderThread.kill();
		}
	}
	private static runningSpinners: number = 0;
	private static uuid = hyperid();
	private static renderThread: child_process.ChildProcess;
	private static checkClose() {
		setTimeout(() => {
			if ((process as any)._getActiveHandles().length === 5 && ThreadSpinner.runningSpinners === 0) {
				ThreadSpinner.shutdown();
			} else {
				ThreadSpinner.checkClose();
			}
		}, 500);
	}
	private options: Options;
	private spinnerId = ThreadSpinner.uuid();
	private currentText: string;

	constructor(options: Options | string) {
		if (ThreadSpinner.renderThread == null) {
			ThreadSpinner.renderThread = child_process.fork(join(__dirname, "worker.js"), ["IS_SPINNER_CHILD"]);
			ThreadSpinner.checkClose();
		}
		this.send({
			type: "Create",
			body: options,
		});
		if (typeof options === "string") {
			this.currentText = options;
		} else {
			this.options = options;
		}
	}

	public set text(val: string) {
		this.currentText = val;
		this.send({
			type: "Text",
			body: val,
		});
	}

	public start(text?: string) {
		this.currentText = text;
		ThreadSpinner.runningSpinners++;
		this.send({
			type: "Start",
			body: text,
		});
	}

	public succeed(text?: string) {
		this.currentText = text;
		ThreadSpinner.runningSpinners--;
		this.send({
			type: "Succeed",
			body: text,
		});
	}

	public stop() {
		ThreadSpinner.runningSpinners--;
		this.send({
			type: "Stop",
		});
	}

	public fail(text?: string) {
		this.currentText = text;
		ThreadSpinner.runningSpinners--;
		this.send({
			type: "Fail",
			body: text,
		});
	}

	public info(text?: string) {
		this.currentText = text;
		ThreadSpinner.runningSpinners--;
		this.send({
			type: "Info",
			body: text,
		});
	}

	public warn(text?: string) {
		this.currentText = text;
		ThreadSpinner.runningSpinners--;
		this.send({
			type: "Warn",
			body: text,
		});
	}

	public persist(options?: PersistOptions) {
		ThreadSpinner.runningSpinners--;
		this.send({
			type: "Persist",
			body: options,
		});
	}

	private send(message: SpinnerMessage): string {
		const id = ThreadSpinner.uuid();
		ThreadSpinner.renderThread.send({
			msg: message,
			spinId: this.spinnerId,
			reqId: id,
		});
		return id;
	}
}
