import { exec } from "child_process";
import { levels as LOG } from "./logging";

export class CmdLine {
	command: string;
	timeoutMs: number;

	constructor(command: string, timeoutMs: number) {
		this.command = command;
		this.timeoutMs = timeoutMs;
	}

	async execute(): Promise<string | void> {
		const commandOp = this.runCommand();
		const timeoutOp = this.runTimeout();
		const res = await Promise.race([commandOp, timeoutOp]);
		return res;
	}

	async runCommand(): Promise<string> {
		return new Promise((res, rej) => {
			const proc = exec(this.command);
			let output = ``;

			proc.on("error", (err) => {
				LOG.error(`CLI returned error`, err);
				rej(err);
			});
			proc.on("exit", (code) => {
				res(output);
			});
			proc.stdout?.on("data", (chunk) => {
				output += chunk.toString();
			});
		});
	}

	async runTimeout(): Promise<void> {
		return new Promise((res, rej) => {
			setTimeout(() => {
				res();
			}, this.timeoutMs);
		});
	}
}
