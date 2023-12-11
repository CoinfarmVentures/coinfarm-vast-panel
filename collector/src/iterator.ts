import { CliVastAPI } from "./api";
import { DB_CONN_INFO } from "./config";
import { convertMachines } from "./conversion";
import { DBInserter } from "./db";
import { API_Machine, Credentials, DB_Machine } from "./models";
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
		if (process.env.CREDENTIAL_USER_ID && process.env.CREDENTIAL_API_KEY) {
			LOG.debug(`Reading credentials from environment`);
			this.credentials = {
				apiKey: process.env.CREDENTIAL_API_KEY,
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
		let apiClient: CliVastAPI;

		try {
			if (!this.credentials) await this.readCredentials();
			if (!this.credentials) throw new Error("Failed to obtain credentials");

			apiClient = new CliVastAPI(this.credentials);
		} catch (e) {
			LOG.error(`Error initializing API client`, e);
			return;
		}

		let rawMachines: API_Machine[];

		try {
			LOG.debug("Getting machines...");
			rawMachines = await apiClient.getMachines();
		} catch (e) {
			LOG.error(`Error retrieving data from API`, e);
			return;
		}

		let dbMachines: DB_Machine[];

		try {
			LOG.debug("Converting machine data...");
			dbMachines = convertMachines(rawMachines);
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
			}
		} catch (e) {
			LOG.error(`Error storing data in database`, e);
			return;
		}

		LOG.info("Collection complete");
	}
}
