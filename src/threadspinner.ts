import child_process = require("child_process");
import {Options, PersistOptions, SpinnerMessage, SpinnerMessageSerialized, SpinnerPersist} from "./types";
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
	private startTime = Date.now();
	private options: Options;
	private spinnerId = ThreadSpinner.uuid();
	private currentText: string;
	private localHandle: any = null;

	constructor(options?: Options | string, private noThread: boolean = false, private includeTime = false) {
		if (ThreadSpinner.renderThread == null && !this.noThread) {
			ThreadSpinner.renderThread = child_process.fork(join(__dirname, "worker.js"), ["IS_SPINNER_CHILD"]);
			// ThreadSpinner.checkClose();
		}

		if (this.noThread) {
			this.localHandle = require("./worker").handleMessage;
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
		this.startTime = Date.now();
		this.currentText = text;
		ThreadSpinner.runningSpinners++;
		return this.send({
			type: "Start",
			body: text,
		});
	}

	public succeed(text: string = this.currentText, includeTime = this.includeTime) {
		const withTime = (includeTime) ? this.getTimeText(text) : text;
		this.currentText = withTime;
		ThreadSpinner.runningSpinners--;
		return this.send({
			type: "Succeed",
			body: withTime,
		});
	}

	public stop() {
		ThreadSpinner.runningSpinners--;
		return this.send({
			type: "Stop",
		});
	}

	public fail(text: string = this.currentText, includeTime = this.includeTime) {
		const withTime = (includeTime) ? this.getTimeText(text) : text;
		this.currentText = withTime;
		ThreadSpinner.runningSpinners--;
		return this.send({
			type: "Fail",
			body: withTime,
		});
	}

	public info(text?: string) {
		this.currentText = text;
		ThreadSpinner.runningSpinners--;
		return this.send({
			type: "Info",
			body: text,
		});
	}

	public warn(text?: string) {
		this.currentText = text;
		ThreadSpinner.runningSpinners--;
		return this.send({
			type: "Warn",
			body: text,
		});
	}

	public persist(options?: PersistOptions) {
		ThreadSpinner.runningSpinners--;
		return this.send({
			type: "Persist",
			body: options,
		});
	}

	private send(message: SpinnerMessage): Promise<void> {
		const id = ThreadSpinner.uuid();
		// console.log("sent", message.type, id);
		if (this.noThread) {
			this.localHandle({
				msg: message,
				spinId: this.spinnerId,
				reqId: id,
			}, false);
			return Promise.resolve();
		}

		if (message.type === "Create") {
			ThreadSpinner.renderThread.send({
				msg: message,
				spinId: this.spinnerId,
				reqId: id,
			});
			return;
		}
		return new Promise((resolve) => {
			ThreadSpinner.renderThread.send({
				msg: message,
				spinId: this.spinnerId,
				reqId: id,
			});
			const handler = (msg: SpinnerMessageSerialized) => {
				switch (msg.msg.type) {
					case "Ack":
						if (msg.reqId === id && msg.spinId === this.spinnerId) {
							// console.log("got ack", msg.msg.type, msg.reqId);
							resolve();
							ThreadSpinner.renderThread.removeListener("message", handler);
						}
				}
			};
			ThreadSpinner.renderThread.on("message", handler);
		});
	}

	private getTimeText(text: string) {
		const end = Date.now();
		return `${text} (${(end - this.startTime)}ms)`;
	}
}
