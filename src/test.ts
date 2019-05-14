import {ThreadSpinner} from "./threadspinner";
import ora = require("ora");

const spinTest = async () => {
	const NUM = 999999;
	let spinner;
	let test;
	let stop;

	spinner = new ThreadSpinner({
		text: "test spinner",
		// spinner: "bouncingBall",
	}, false, true);
	await spinner.start();

// new ThreadSpinner("other test").start();
// ora("test spinner").start();

	test = 0;
	stop = false;

	while (!stop) {
		test += 0.01;
		// spinner.text = test + "";
		if (test >= NUM) {
			stop = true;
			await spinner.succeed("yay");
		}
	}

	await spinner.start("test spinner 2");
// spinner = new ThreadSpinner({
// 	text: "test spinner 2",
// });
// spinner.start();

// new ThreadSpinner("other test").start();
// ora("test spinner").start();

	test = 0;
	stop = false;

	await spinner.warn("blah");
	while (!stop) {
		test += 0.01;
		if (test >= NUM) {
			stop = true;
			await spinner.succeed("yay");
		}
	}

	await spinner.start("test spinner 3");
// spinner = new ThreadSpinner({
// 	text: "test spinner 3",
// 	spinner: "earth",
// });
// spinner.start();

// new ThreadSpinner("other test").start();
// ora("test spinner").start();

	test = 0;
	stop = false;

	while (!stop) {
		test += 0.01;
		if (test >= NUM) {
			stop = true;
			await spinner.fail("yay");
		}
	}

	ThreadSpinner.shutdown();
};

spinTest();
