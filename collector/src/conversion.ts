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

	return {
		MachineID: apiMachine.machine_id ?? apiMachine.id,
		MaxGpuTemp: apiMachine.gpu_max_cur_temp ?? 0,
		ListedGpuRate: apiMachine.listed_gpu_cost ?? 0,
		NumGpus: apiMachine.num_gpus ?? 0,
		NumGpusDemandOcc: gpusDemandOccupied ?? 0,
		NumGpusSpotOcc: gpusSpotOccupied ?? 0,
		NumGpusVacant: gpusVacant ?? 0,
		DiskFreeGB: apiMachine.disk_space ?? 0,
		DiskBwGBs: apiMachine.disk_bw ?? 0,
		InetUpMbps: apiMachine.inet_up ?? 0,
		InetDownMbps: apiMachine.inet_down ?? 0,
		EarnHour: apiMachine.earn_hour ?? 0,
		EarnDay: apiMachine.earn_day ?? 0,
		NumStoredRentalsDemand: apiMachine.current_rentals_on_demand ?? 0,
		NumStoredRentalsSpot:
			(apiMachine.current_rentals_resident ?? 0) -
			(apiMachine.current_rentals_on_demand ?? 0),
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
