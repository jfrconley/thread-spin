# thread-spin
***Thread based, truly async spinner based on ora***

## Usage
Install from npm
```bash
npm i thread-spin
```
Then instantiate ThreadSpinner
```typescript
import {ThreadSpinner} from "thread-spin"

// The options are the same as an ora spinner
const spinner = new ThreadSpinner({
    text: "threaded spinner",
    spinner: "bouncing ball"
});

// Most of the methods are the same as ora, just now return promises
spinner.start().then(()=>{
    return spinner.succeed();
}).then(()=>{
    // Stop the thread when you're done
    ThreadSpinner.shutdown();
});
```

## Why?
Ora is a great library, but won't work well if you're running a spinner for something that blocks the event loop. This library is for when you need your spinners to spin no matter what is happening in the main process.