import { ElementWrapper } from "../wrapper";

type ExtendFunction = (
	name: string,
	func: (this: ElementWrapper, ...args: any[]) => any,
) => void;

export class Plugin {
	public name: string;
	private readonly install: ($: ExtendFunction) => void;

	constructor(name: string, install: (extend: ExtendFunction) => void) {
		this.name = name;
		this.install = install;
	}

	getInstaller() {
		return this.install;
	}
}

const installedPlugins = new Set<string>();

export function use(plugin: Plugin): void {
	if (installedPlugins.has(plugin.name)) {
		console.warn(`Plugin "${plugin.name}" is already installed`);
		return;
	}

	try {
		const extendFunction: ExtendFunction = (
			name: string,
			func: (this: ElementWrapper, ...args: any[]) => any,
		) => {
			ElementWrapper.extend(name, func);
		};

		plugin.getInstaller()(extendFunction);
		installedPlugins.add(plugin.name);
	} catch (error) {
		console.error(`Failed to install plugin "${plugin.name}":`, error);
	}
}
