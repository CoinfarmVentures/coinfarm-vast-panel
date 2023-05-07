import { VastAPI } from "./api";
import { DB_CONN_INFO } from "./config";
import { convertEarnings, convertMachines } from "./conversion";
import { DBInserter } from "./db";
import {
	API_Earnings,
	API_Machine,
	Credentials,
	DB_Earnings,
	DB_Machine,
} from "./models";
import { levels as LOG } from "./logging";
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
			LOG.debug(`Reading credentials from environment`);
			return {
				authKey: process.env.CREDENTIAL_AUTH_KEY,
				userId: Number(process.env.CREDENTIAL_USER_ID),
			};
		}

		const credPath = `${process.cwd()}/collector/credentials.json`;
		LOG.debug(`Reading credentials from disk (${credPath})`);

		const txt = await fsp.readFile(credPath, {
			encoding: "utf-8",
		});

		const credentials: Credentials = JSON.parse(txt) as Credentials;
		return credentials;
	}

	async iteration(): Promise<void> {
		LOG.info("Collecting account data...");
		let apiClient: VastAPI;

		try {
			const credentials: Credentials = await this.readCredentials();
			apiClient = new VastAPI(credentials);
		} catch (e) {
			LOG.error(`Error initializing API client`, e);
			return;
		}

		let rawMachines: API_Machine[];
		let rawEarnings: API_Earnings[];

		try {
			LOG.debug("Getting machines...");
			rawMachines = await apiClient.getMachines();
			LOG.debug("Getting earnings...");
			rawEarnings = await apiClient.getEarnings();
		} catch (e) {
			LOG.error(`Error retrieving data from API`, e);
			return;
		}

		let dbMachines: DB_Machine[];
		let dbEarnings: DB_Earnings[];

		try {
			LOG.debug("Converting machine data...");
			dbMachines = convertMachines(rawMachines);
			LOG.debug("Converting earning data...");
			dbEarnings = convertEarnings(rawEarnings);
		} catch (e) {
			LOG.error(`Error transforming data`, e);
			return;
		}

		try {
			const inserter = new DBInserter(DB_CONN_INFO);
			LOG.debug("Inserting machines...");
			await inserter.insertMachines(dbMachines);
			LOG.debug("Inserting earnings...");
			await inserter.insertEarnings(dbEarnings);
			LOG.info("Collection successful");
		} catch (e) {
			LOG.error(`Error storing data in database`, e);
			return;
		}

		LOG.info("Collection complete");
	}
}
