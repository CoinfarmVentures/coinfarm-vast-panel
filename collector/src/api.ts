import { CmdLine } from "./cmdline";
import { CLI_LOCATION, PROC_TIMEOUT_MS, PYTHON_EXEC_NAME } from "./config";
import { API_Machine, API_Machine_Resp, Credentials } from "./models";
import { levels as LOG } from "./logging";

interface IVastAPI {
	getMachines(): Promise<API_Machine[]>;
}

export class CliVastAPI implements IVastAPI {
	credentials: Credentials;

	constructor(credentials: Credentials) {
		this.credentials = credentials;
	}

	async cliExecute(command: string): Promise<JSON> {
		const cmd = new CmdLine(
			`${PYTHON_EXEC_NAME} ${CLI_LOCATION} ${command} --api-key ${this.credentials.apiKey} --raw`,
			PROC_TIMEOUT_MS
		);
		const outputRaw = await cmd.execute();

		if (!outputRaw) {
			throw new Error(`CLI command ${cmd.command} failed`);
		}

		try {
			return JSON.parse(outputRaw);
		} catch (e) {
			throw new Error(`Output is invalid JSON: ${e} ${outputRaw}`);
		}
	}

	async getMachines(): Promise<API_Machine[]> {
		const res = await this.cliExecute("show machines");
		const parsed: API_Machine[] = new VastCliParser().parseMachines(res);
		return parsed;
	}
}

export class VastCliParser {
	parseMachines(outputRaw: JSON): API_Machine[] {
		const machinesRaw = outputRaw as unknown as API_Machine_Resp;
		return machinesRaw;
	}
}
