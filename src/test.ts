import {ThreadSpinner} from "./threadspinner";
import ora = require("ora");

const spinTest = async () => {
	let spinner;
	let test;
	let stop;

	spinner = new ThreadSpinner({
		text: "test spinner",
		spinner: "bouncingBall",
	});
	await spinner.start();

// new ThreadSpinner("other test").start();
// ora("test spinner").start();

	test = 0;
	stop = false;

	while (!stop) {
		test += 0.01;
		// spinner.text = test + "";
		if (test >= 9999999) {
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

	while (!stop) {
		test += 0.01;
		if (test >= 9999999) {
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
		if (test >= 9999999) {
			stop = true;
			await spinner.succeed("yay");
		}
	}

	ThreadSpinner.shutdown();
};

spinTest();