const readableTime = () => new Date().toISOString();

export const levels = {
	error: (msg: string, e?: unknown) => {
		console.log(`${readableTime()} | ERROR | ${msg} ${e ?? ""}`);
		console.error(`${readableTime()} | ERROR | ${msg} ${e ?? ""}`);
	},
	warn: (msg: string) => console.log(`${readableTime()} | WARN | ${msg}`),
	info: (msg: string) => console.log(`${readableTime()} | INFO | ${msg}`),
	debug: (msg: string) => console.log(`${readableTime()} | DEBUG | ${msg}`),
};
