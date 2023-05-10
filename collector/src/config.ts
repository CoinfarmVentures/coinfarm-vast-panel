import { DB_ConnectionInfo } from "./models";

export const POLL_INTERVAL_SEC = process.env.POLL_INTERVAL_SEC
	? Number(process.env.POLL_INTERVAL_SEC)
	: 5 * 60;

export const VAST_API_HOSTNAME = process.env.VAST_API_HOSTNAME ?? "console.vast.ai";

export const DB_CONN_INFO: DB_ConnectionInfo = {
	host: "coinfarm-vast-panel-db", //"127.0.0.1",
	username: "collector",
	password: "collector",
	schema: "vast",
};
