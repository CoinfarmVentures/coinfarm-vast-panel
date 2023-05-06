import { VAST_API_HOSTNAME } from "./config";
import {
	API_Earnings,
	API_Earnings_Resp,
	API_Machine,
	API_Machine_Resp,
	Credentials,
} from "./models";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import Axios from "axios";

interface IVastAPI {
	getMachines(): Promise<API_Machine[]>;
	getEarnings(): Promise<API_Earnings[]>;
}

export class VastAPI implements IVastAPI {
	credentials: Credentials;

	constructor(credentials: Credentials) {
		this.credentials = credentials;
	}

	async getRequest<R>(method: string): Promise<R> {
		const reqConfig: AxiosRequestConfig = {
			baseURL: `https://${VAST_API_HOSTNAME}/api/v0/`,
			method: "get",
			params: {},
			headers: {
				Connection: "keep-alive",
				Referer: "https://cloud.vast.ai/host/machines/",
				"User-Agent":
					"Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/112.0",
				Cookie: `auth_tkt=${this.credentials.authKey}`,
				"Cache-Control": "max-age=0",
			},
		};

		const res: AxiosResponse<R> = await Axios.get(method, reqConfig);
		return res.data;
	}

	async getMachines(): Promise<API_Machine[]> {
		const rawData = (
			await this.getRequest<{ machines: API_Machine_Resp }>("machines")
		).machines;
		const machines: API_Machine[] = [];

		Object.keys(rawData).forEach((key: string) => {
			const machineObj: API_Machine = rawData[key] as API_Machine;
			machines.push(machineObj);
		});
		return machines;
	}

	async getEarnings(): Promise<API_Earnings[]> {
		const daysSinceEpoch = Math.floor(new Date().getTime() / 1000 / 86400);
		const latestFullDay = daysSinceEpoch - 1;
		const path = `users/${this.credentials.userId}/machine-earnings/?sday=${latestFullDay}&eday=${latestFullDay}`;

		const rawData = (
			await this.getRequest<{ per_machine: API_Earnings_Resp }>(path)
		).per_machine;
		const machineEarnings: API_Earnings[] = [];

		Object.keys(rawData).forEach((key: string) => {
			const machineEarningsObj: API_Earnings = rawData[key] as API_Earnings;
			machineEarnings.push(machineEarningsObj);
		});
		return machineEarnings;
	}
}
