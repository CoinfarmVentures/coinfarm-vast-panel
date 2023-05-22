export interface API_Earnings_Resp {
	[machineId: string]: API_Earnings;
}

export interface API_Earnings {
	machine_id: number;
	gpu_earn: number;
	sto_earn: number;
	bwu_earn: number;
	bwd_earn: number;
	timestamp: number;
}

export interface API_Machine_Resp {
	[machineId: string]: API_Machine;
}

export interface API_Machine {
	id: number;
	machine_id: number;
	hostname: string;
	geolocation: null;
	timeout: number;
	mobo_name: string;
	num_gpus: number;
	total_flops: number;
	gpu_name: string;
	gpu_ram: number;
	gpu_max_cur_temp: number;
	gpu_lanes: number;
	gpu_mem_bw: number;
	bw_nvlink: null;
	pcie_bw: number;
	pci_gen: number;
	cpu_name: string;
	cpu_ram: number;
	cpu_cores: number;
	listed: boolean;
	start_date: null;
	end_date: number;
	listed_min_gpu_count: number;
	listed_gpu_cost: number;
	listed_storage_cost: number;
	listed_inet_up_cost: number;
	listed_inet_down_cost: number;
	min_bid_price: number;
	gpu_occupancy: string;
	bid_gpu_cost: null;
	bid_image: null;
	bid_image_args: null;
	bid_image_args_str: null;
	disk_space: number;
	disk_name: string;
	disk_bw: number;
	inet_up: number;
	inet_down: number;
	earn_hour: number;
	earn_day: number;
	verification: string;
	error_description: null;
	current_rentals_running: number;
	current_rentals_running_on_demand: number;
	current_rentals_resident: number;
	current_rentals_on_demand: number;
	reliability2: number;
	direct_port_count: number;
	public_ipaddr: string;
}

export interface Credentials {
	userId: number;
	authKey: string;
}

export interface DB_Earnings {
	MachineID: number;
	GpuEarn: number;
	StoEarn: number;
	UploadEarn: number;
	DownloadEarn: number;
}

export interface DB_Machine {
	Hostname: string;
	MachineID: number;
	MaxGpuTemp: number;
	ListedGpuRate: number;
	NumGpus: number;
	NumGpusDemandOcc: number;
	NumGpusSpotOcc: number;
	NumGpusVacant: number;
	DiskFreeGB: number;
	DiskBwGBs: number;
	InetUpMbps: number;
	InetDownMbps: number;
	EarnHour: number;
	EarnDay: number;
	NumStoredRentalsDemand: number;
	NumStoredRentalsSpot: number;
	Reliability: number;
}

export interface DB_ConnectionInfo {
	host: string;
	port: number;
	username: string;
	password: string;
	schema: string;
}
