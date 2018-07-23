import ora = require("ora");
import {SpinnerMessageSerialized} from "./types";

const spinners: {[id: string]: any} = {};

function handleMessage(msg: SpinnerMessageSerialized) {
	switch (msg.msg.type) {
		case "Create":
			spinners[msg.spinId] = ora(msg.msg.body);
			break;
		case "Start":
			spinners[msg.spinId].start(msg.msg.body);
			break;
		case "Succeed":
			spinners[msg.spinId].succeed(msg.msg.body);
			break;
		case "Stop":
			spinners[msg.spinId].stop();
			break;
		case "Fail":
			spinners[msg.spinId].fail(msg.msg.body);
			break;
		case "Warn":
			spinners[msg.spinId].warn(msg.msg.body);
			break;
		case "Info":
			spinners[msg.spinId].info(msg.msg.body);
			break;
		case "Persist":
			spinners[msg.spinId].stopAndPersist(msg.msg.body);
			break;
		case "Clear":
			spinners[msg.spinId].clear();
			break;
	}
}

process.on("message", handleMessage);
