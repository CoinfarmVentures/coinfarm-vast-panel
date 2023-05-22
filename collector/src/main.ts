//loop iteration:
//	1: read auth key from disk
//	2: query JSON API with Axios
//	3: transform result to SQL format
//	4: connect to MySQL
//	5: execute INSERT statements

import { POLL_INTERVAL_SEC } from "./config";
import { Iterator } from "./iterator";

const iter: Iterator = new Iterator(POLL_INTERVAL_SEC);
iter.start();
console.log("Started loop");
