import { DB_ConnectionInfo } from "./models";

export const POLL_INTERVAL_SEC = process.env.POLL_INTERVAL_SEC
	? Number(process.env.POLL_INTERVAL_SEC)
	: 5 * 60;
export const SKIP_START_DELAY = Boolean(process.env.SKIP_START_DELAY ?? false);

export const VAST_API_HOSTNAME = process.env.VAST_API_HOSTNAME ?? "cloud.vast.ai";

export const DB_CONN_INFO: DB_ConnectionInfo = {
	host: process.env.DB_HOSTNAME ?? "coinfarm-vast-panel-db", //:5001 "127.0.0.1",
	port: Number(process.env.DB_PORT ?? 3306),
	username: "collector",
	password: "collector",
	schema: "vast",
};

export const PROC_TIMEOUT_MS = 10 * 1000;
const CWD = process.cwd();
export const CLI_LOCATION = CWD.includes("collector")
	? `"${CWD}/bin/vastcli_112623.py"`
	: `"${CWD}/collector/bin/vastcli_112623.py"`;
export const PYTHON_EXEC_NAME = process.env.PYTHON_EXEC_NAME ?? "python3";
