import { DB_ConnectionInfo, DB_Earnings, DB_Machine } from "./models";
import mysql from "mysql";

interface IDBInserter {
	connectionInfo: DB_ConnectionInfo;
	insertMachines(data: DB_Machine[]): Promise<void>;
	insertEarnings(data: DB_Earnings[]): Promise<void>;
}

export class DBInserter implements IDBInserter {
	connectionInfo: DB_ConnectionInfo;
	connection: mysql.Connection | null;

	constructor(connectionInfo: DB_ConnectionInfo) {
		this.connectionInfo = connectionInfo;
		this.connection = null;
	}

	connect(): Promise<void> {
		return new Promise((res, rej) => {
			this.connection = mysql.createConnection({
				host: this.connectionInfo.host,
				port: this.connectionInfo.port ?? undefined,
				user: this.connectionInfo.username,
				// localAddress: "127.0.0.1",
				password: this.connectionInfo.password,
				database: this.connectionInfo.schema,
			});

			this.connection.connect((err: mysql.MysqlError) => {
				if (err) {
					this.connection = null;
					rej(err);
				} else res();
			});
		});
	}

	async insert(queryStr: string): Promise<void> {
		if (!this.connection) {
			await this.connect();
		}

		return new Promise((res, rej) => {
			this.connection?.query(queryStr, (error, results, fields) => {
				if (error) rej(error);
				res();
			});
		});
	}

	async insertMachines(data: DB_Machine[]): Promise<void> {
		let queryStr = `INSERT INTO machines VALUES\n`;
		data.forEach((machine: DB_Machine) => {
			queryStr += `(NOW(), '${machine.Hostname}', ${machine.MachineID}, ${machine.MaxGpuTemp}, ${machine.ListedGpuRate}, ${machine.NumGpus}, ${machine.NumGpusDemandOcc}, ${machine.NumGpusSpotOcc}, ${machine.NumGpusVacant}, ${machine.DiskFreeGB}, ${machine.DiskBwGBs}, ${machine.InetUpMbps}, ${machine.InetDownMbps}, ${machine.EarnHour}, ${machine.EarnDay}, ${machine.NumStoredRentalsDemand}, ${machine.NumStoredRentalsSpot}, ${machine.Reliability}),\n`;
		});
		queryStr = queryStr.substring(0, queryStr.length - 2);
		queryStr += `;`;

		await this.insert(queryStr);
	}

	async insertEarnings(data: DB_Earnings[]): Promise<void> {
		let queryStr = `INSERT INTO earnings VALUES\n`;
		data.forEach((machine: DB_Earnings) => {
			queryStr += `(NOW(), ${machine.MachineID}, ${machine.GpuEarn}, ${machine.StoEarn}, ${machine.UploadEarn}, ${machine.DownloadEarn}),\n`;
		});
		queryStr = queryStr.substring(0, queryStr.length - 2);
		queryStr += `;`;

		await this.insert(queryStr);
	}
}
