import { VastAPI } from "./api";
import { DB_CONN_INFO } from "./config";
import { convertEarnings, convertMachines } from "./conversion";
import { DBInserter } from "./db";
import { Credentials } from "./models";
import fsp from "fs/promises";

interface IIterator {
	start(): void;
}

export class Iterator implements IIterator {
	intervalSec: number;

	constructor(intervalSec: number) {
		this.intervalSec = intervalSec;
	}

	start(): void {
		setTimeout(async () => {
			await this.iteration();
		}, 0);
		setInterval(async () => {
			await this.iteration();
		}, this.intervalSec * 1000);
	}

	async readCredentials(): Promise<Credentials> {
		if (process.env.CREDENTIAL_USER_ID && process.env.CREDENTIAL_AUTH_KEY) {
			return {
				authKey: process.env.CREDENTIAL_AUTH_KEY,
				userId: Number(process.env.CREDENTIAL_USER_ID),
			};
		}

		const txt = await fsp.readFile(
			`${process.cwd()}/collector/credentials.json`,
			{
				encoding: "utf-8",
			}
		);

		const credentials: Credentials = JSON.parse(txt) as Credentials;
		return credentials;
	}

	async iteration(): Promise<void> {
		const credentials: Credentials = await this.readCredentials();
		const apiClient = new VastAPI(credentials);

		const rawMachines = await apiClient.getMachines();
		const dbMachines = convertMachines(rawMachines);

		const rawEarnings = await apiClient.getEarnings();
		const dbEarnings = convertEarnings(rawEarnings);

		const inserter = new DBInserter(DB_CONN_INFO);
		await inserter.insertMachines(dbMachines);
		await inserter.insertEarnings(dbEarnings);
	}
}
