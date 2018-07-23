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

	constructor(options?: Options | string) {
		if (ThreadSpinner.renderThread == null) {
			ThreadSpinner.renderThread = child_process.fork(join(__dirname, "worker.js"), ["IS_SPINNER_CHILD"]);
			// ThreadSpinner.checkClose();
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

	public async start(text?: string) {
		this.currentText = text;
		ThreadSpinner.runningSpinners++;
		await this.send({
			type: "Start",
			body: text,
		});
	}

	public async succeed(text?: string) {
		this.currentText = text;
		ThreadSpinner.runningSpinners--;
		await this.send({
			type: "Succeed",
			body: text,
		});
	}

	public async stop() {
		ThreadSpinner.runningSpinners--;
		await this.send({
			type: "Stop",
		});
	}

	public async fail(text?: string) {
		this.currentText = text;
		ThreadSpinner.runningSpinners--;
		await this.send({
			type: "Fail",
			body: text,
		});
	}

	public async info(text?: string) {
		this.currentText = text;
		ThreadSpinner.runningSpinners--;
		await this.send({
			type: "Info",
			body: text,
		});
	}

	public async warn(text?: string) {
		this.currentText = text;
		ThreadSpinner.runningSpinners--;
		await this.send({
			type: "Warn",
			body: text,
		});
	}

	public async persist(options?: PersistOptions) {
		ThreadSpinner.runningSpinners--;
		await this.send({
			type: "Persist",
			body: options,
		});
	}

	private send(message: SpinnerMessage): Promise<void> {
		const id = ThreadSpinner.uuid();
		// console.log("sent", message.type, id);
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
}
