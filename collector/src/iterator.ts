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
	credentials: Credentials | undefined;
	inserter: DBInserter | undefined;

	constructor(intervalSec: number) {
		this.intervalSec = intervalSec;
		this.credentials = undefined;
		this.inserter = undefined;
	}

	start(): void {
		setTimeout(async () => {
			try {
				await this.iteration();
			} catch (e) {
				LOG.error(`General error during first iteration: ${e}`);
			}
		}, 60000);

		setInterval(async () => {
			try {
				await this.iteration();
			} catch (e) {
				LOG.error(`General error during iteration: ${e}`);
			}
		}, this.intervalSec * 1000);
	}

	async readCredentials(): Promise<void> {
		if (process.env.CREDENTIAL_USER_ID && process.env.CREDENTIAL_AUTH_KEY) {
			LOG.debug(`Reading credentials from environment`);
			this.credentials = {
				authKey: process.env.CREDENTIAL_AUTH_KEY,
				userId: Number(process.env.CREDENTIAL_USER_ID),
			};
		}

		const credPath = `${process.cwd()}/credentials.json`;
		LOG.debug(`Reading credentials from disk (${credPath})`);

		const txt = await fsp.readFile(credPath, {
			encoding: "utf-8",
		});

		this.credentials = JSON.parse(txt) as Credentials;
	}

	async iteration(): Promise<void> {
		LOG.info("Collecting account data...");
		let apiClient: VastAPI;

		try {
			if (!this.credentials) await this.readCredentials();
			apiClient = new VastAPI(this.credentials as Credentials);
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
			if (!this.inserter || this.inserter.connection === null) {
				LOG.debug("Creating new inserter object...");
				this.inserter = new DBInserter(DB_CONN_INFO);
			}

			try {
				LOG.debug("Inserting machines...");
				await this.inserter.insertMachines(dbMachines);
			} catch (e) {
				LOG.warn(`Error storing machine data`, e);
				// try {
				// 	LOG.debug("Inserting machines (attempt 2)...");
				// 	await this.inserter.insertMachines(dbMachines);
				// } catch (e2) {
				// 	LOG.error(`Error storing machine data (attempt 2)`, e2);
				// }
			}

			try {
				LOG.debug("Inserting earnings...");
				await this.inserter.insertEarnings(dbEarnings);
			} catch (e) {
				LOG.warn(`Error storing earning data`, e);
				// try {
				// 	LOG.debug("Inserting earnings (attempt 2)...");
				// 	await this.inserter.insertEarnings(dbEarnings);
				// } catch (e2) {
				// 	LOG.error(`Error storing earning data (attempt 2)`, e2);
				// }
			}
		} catch (e) {
			LOG.error(`Error storing data in database`, e);
			return;
		}

		LOG.info("Collection complete");
	}
}
