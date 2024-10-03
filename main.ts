import {
	App,
	Editor,
	MarkdownView,
	Modal,
	Notice,
	Plugin,
	PluginSettingTab,
	Setting,
} from "obsidian";
import { EOL } from "os";

// Remember to rename these classes and interfaces!

interface MyPluginSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	mySetting: "default",
};

export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;

	async onload() {
		await this.loadSettings();
	}

	onunload() {
		this.addCommand({
			id: "check link",
			name: "Check Link",
			callback: async () => {
				let mdFiles = this.app.metadataCache.unresolvedLinks;
				let errorFilePath = [];
				for (const mdFilePath of Object.keys(mdFiles)) {
					let links = Object.keys(mdFiles[mdFilePath]);
					if (links.length > 0) {
						errorFilePath.push(mdFilePath);
					}
				}
				let errorShowFile = await this.app.vault.create(
					"link-checker_result.md",
					errorFilePath.map((v) => `[[${v}]]`).join(EOL)
				);
				this.app.workspace.getLeaf().openFile(errorShowFile);
			},
		});
	}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
