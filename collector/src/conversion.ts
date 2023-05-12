import { API_Earnings, API_Machine, DB_Earnings, DB_Machine } from "./models";

function countInstances(str: string, word: string) {
	return str.split(word).length - 1;
}

const convertMachine = (apiMachine: API_Machine): DB_Machine => {
	const gpusDemandOccupied = apiMachine.gpu_occupancy
		? countInstances(apiMachine.gpu_occupancy, "D")
		: 0;
	const gpusSpotOccupied = apiMachine.gpu_occupancy
		? countInstances(apiMachine.gpu_occupancy, "I")
		: 0;
	const gpusVacant = apiMachine.gpu_occupancy
		? countInstances(apiMachine.gpu_occupancy, "x")
		: apiMachine.num_gpus;
	const machineId = apiMachine.machine_id ?? apiMachine.id;

	return {
		Hostname: apiMachine.hostname ?? `${machineId}`,
		MachineID: Number(machineId),
		MaxGpuTemp: Number(apiMachine.gpu_max_cur_temp) ?? 0,
		ListedGpuRate: Number(apiMachine.listed_gpu_cost) ?? 0,
		NumGpus: Number(apiMachine.num_gpus) ?? 0,
		NumGpusDemandOcc: Number(gpusDemandOccupied) ?? 0,
		NumGpusSpotOcc: Number(gpusSpotOccupied) ?? 0,
		NumGpusVacant: Number(gpusVacant) ?? 0,
		DiskFreeGB: Number(apiMachine.disk_space) ?? 0,
		DiskBwGBs: Number(apiMachine.disk_bw) ?? 0,
		InetUpMbps: Number(apiMachine.inet_up) ?? 0,
		InetDownMbps: Number(apiMachine.inet_down) ?? 0,
		EarnHour: Number(apiMachine.earn_hour) ?? 0,
		EarnDay: Number(apiMachine.earn_day) ?? 0,
		NumStoredRentalsDemand: Number(apiMachine.current_rentals_on_demand) ?? 0,
		NumStoredRentalsSpot:
			(Number(apiMachine.current_rentals_resident) ?? 0) -
			(Number(apiMachine.current_rentals_on_demand) ?? 0),
		Reliability: Number(apiMachine.reliability2 ?? 0),
	};
};

export const convertMachines = (apiMachines: API_Machine[]): DB_Machine[] => {
	return apiMachines.map((raw) => convertMachine(raw));
};

const convertEarning = (apiEarnings: API_Earnings): DB_Earnings => {
	return {
		MachineID: apiEarnings.machine_id,
		GpuEarn: apiEarnings.gpu_earn,
		StoEarn: apiEarnings.sto_earn,
		UploadEarn: apiEarnings.bwu_earn,
		DownloadEarn: apiEarnings.bwd_earn,
	};
};

export const convertEarnings = (apiMachines: API_Earnings[]): DB_Earnings[] => {
	return apiMachines.map((raw) => convertEarning(raw));
};
