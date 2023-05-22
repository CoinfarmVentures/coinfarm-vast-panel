import { DB_ConnectionInfo } from "./models";

export const POLL_INTERVAL_SEC = process.env.POLL_INTERVAL_SEC
	? Number(process.env.POLL_INTERVAL_SEC)
	: 5 * 60;

export const VAST_API_HOSTNAME = process.env.VAST_API_HOSTNAME ?? "console.vast.ai";

export const DB_CONN_INFO: DB_ConnectionInfo = {
	host: process.env.DB_HOSTNAME ?? "coinfarm-vast-panel-db", //:5001 "127.0.0.1",
	port: 3306,
	username: "collector",
	password: "collector",
	schema: "vast",
};
