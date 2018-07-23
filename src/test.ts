import {ThreadSpinner} from "./threadspinner";
import ora = require("ora");

let spinner;
let test;
let stop;

spinner = new ThreadSpinner({
	text: "test spinner",
	spinner: "bouncingBall",
});
spinner.start();

// new ThreadSpinner("other test").start();
// ora("test spinner").start();

test = 0;
stop = false;

while (!stop) {
	test += 0.01;
	if (test >= 9999999) {
		stop = true;
		spinner.succeed("yay");
	}
}

spinner = new ThreadSpinner({
	text: "test spinner 2",
});
spinner.start();

// new ThreadSpinner("other test").start();
// ora("test spinner").start();

test = 0;
stop = false;

while (!stop) {
	test += 0.01;
	if (test >= 9999999) {
		stop = true;
		spinner.succeed("yay");
	}
}

spinner = new ThreadSpinner({
	text: "test spinner 3",
	spinner: "earth",
});
spinner.start();

// new ThreadSpinner("other test").start();
// ora("test spinner").start();

test = 0;
stop = false;

while (!stop) {
	test += 0.01;
	if (test >= 9999999) {
		stop = true;
		spinner.succeed("yay");
	}
}
