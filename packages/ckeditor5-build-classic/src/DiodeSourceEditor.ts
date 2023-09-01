import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import SourceIcon from '@ckeditor/ckeditor5-source-editing/theme/icons/source-editing.svg';

const COMMAND_FORCE_DISABLE_ID = 'SourceEditingMode';

export default class DiodeSourceEditor extends Plugin {
	isSourceEditingMode = false;
	sourceEditor: any;
	editorElement: any;
	init() {
		const editor = this.editor;

		this.addSourceEditor();

		editor.ui.componentFactory.add('diodeSourceEditor', (locale) => {
			const button = new ButtonView(locale);
			button.set({
				label: 'Source',
				withText: true,
				icon: SourceIcon,
				tooltip: true,
			});

			// Callback executed once the image is clicked.
			button.on('execute', () => {
				this.isSourceEditingMode = !this.isSourceEditingMode;
				if (this.isSourceEditingMode) {
					this._disableCommands();
				} else {
					this._enableCommands();
				}
			});

			return button;
		});
	}

	/**
	 * Disables all commands.
	 *
	 * @private
	 */
	_disableCommands() {
		const editor = this.editor;

		for (const command of editor.commands.commands()) {
			command.forceDisabled(COMMAND_FORCE_DISABLE_ID);
		}
		// @ts-ignore
		const diodeImageUploader = editor.diodeImageUploaderButton;
		if (diodeImageUploader) {
			diodeImageUploader.element.setAttribute('disabled', '');
			diodeImageUploader.element.classList.add('ck-disabled');
		}

		if (this.sourceEditor) {
			this.sourceEditor.style.display = '';
			this.editorElement.querySelector('.ck-editor__main').style.display =
				'none';
			this.sourceEditor.focus();

			const paths = window.location.pathname
				.split('/')
				.map((e) =>
					encodeURIComponent(e)
						.replace(/[(]/g, '%28')
						.replace(/[)]/g, '%29')
				);
			const driveName = paths[2];
			const basePath = paths.slice(4, paths.length - 1).join('/');

			console.log('driveName', driveName);
			console.log('basePath', basePath);

			// this.sourceEditor.value = replaceAll(this.editor.getData(), `](${dirPath}/`, "](./");
			this.sourceEditor.value = this.editor
				// @ts-ignore
				.getData()
				.replace(
					/!?(\[.*?\]\()(.+?)(\))/g,
					function (
						whole: string,
						prefix: string,
						path: string,
						suffix: string
					) {
						const src = path.trim();
						const isImage = whole.charAt(0) === '!';

						if (isImage) {
							const rootPath = `/drive/${driveName}/download`;
							const dirPath = `/drive/${driveName}/download/${basePath}`;

							const rootHead = src.slice(0, rootPath.length);
							const dirHead = src.slice(0, dirPath.length);

							if (dirHead === dirPath) {
								const rest = src.slice(dirPath.length);
								return `!${prefix}.${rest}${suffix}`;
							} else if (rootHead === rootPath) {
								const rest = src.slice(rootPath.length);
								return `!${prefix}${rest}${suffix}`;
							} else {
								return `!${prefix}${src}${suffix}`;
							}
						} else {
							return `${prefix}${src}${suffix}`;
						}
					}
				);
		}
	}

	async addSourceEditor() {
		this.sourceEditor = document.createElement('textarea');
		this.sourceEditor.classList.add('diode-source-editor');
		this.sourceEditor.style.display = 'none';
		this.sourceEditor.style.width = '100%';
		this.sourceEditor.style.minHeight = '200px';
		this.sourceEditor.addEventListener('input', (e: any) => {
			const rawData = e.target.value;

			const paths = window.location.pathname
				.split('/')
				.map((e) =>
					encodeURIComponent(e)
						.replace(/[(]/g, '%28')
						.replace(/[)]/g, '%29')
				);
			const driveName = paths[2];
			const basePath = paths.slice(4, paths.length - 1).join('/');

			const data = rawData.replace(
				/!?(\[.*?\]\()(.+?)(\))/g,
				function (
					whole: string,
					prefix: string,
					path: string,
					suffix: string
				) {
					const src = path.trim();

					console.log(whole, prefix, path, suffix);
					const isImage = whole.charAt(0) === '!';

					if (isImage) {
						const rootPath = `/drive/${driveName}/download`;
						const dirPath = `/drive/${driveName}/download/${basePath}`;
						const first2 = src.slice(0, 2);
						const first = src.slice(0, 1);

						if (first2 === './') {
							const rest = src.slice(2);
							const newPath = `${dirPath}/${rest}`;
							return `!${prefix}${newPath}${suffix}`;
						} else if (first === '/') {
							const newPath = `${rootPath}${src}`;
							return `!${prefix}${newPath}${suffix}`;
						} else if (src.match(/(^\w+:|^)\/\//g)) {
							return `!${prefix}${src}${suffix}`;
						} else {
							const newPath = `${rootPath}/${src}`;
							return `!${prefix}${newPath}${suffix}`;
						}
					} else {
						const newPath = src;
						return `${prefix}${newPath}${suffix}`;
					}
				}
			);
			// @ts-ignore
			if (this.editor.hook) {
				// @ts-ignore
				this.editor.hook.pushEventTo(
					// @ts-ignore
					this.editor.hook.el,
					'changed',
					data
				);
			}
			// @ts-ignore
			this.editor.setData(data);
		});

		this.editorElement = await waitForElm('.ck-editor');
		this.editorElement.appendChild(this.sourceEditor);
	}

	/**
	 * Clears forced disable for all commands, that was previously set through {@link #_disableCommands}.
	 *
	 * @private
	 */
	_enableCommands() {
		const editor = this.editor;

		for (const command of editor.commands.commands()) {
			command.clearForceDisabled(COMMAND_FORCE_DISABLE_ID);
		}

		// @ts-ignore
		const diodeImageUploader = editor.diodeImageUploaderButton;
		if (diodeImageUploader) {
			diodeImageUploader.element.removeAttribute('disabled', false);
			diodeImageUploader.element.classList.remove('ck-disabled');
		}
		// @ts-ignore
		if (this.sourceEditor) {
			// @ts-ignore
			this.sourceEditor.style.display = 'none';
			// @ts-ignore
			this.editorElement.querySelector('.ck-editor__main').style.display =
				'';
			// @ts-ignore
			this.editorElement.querySelector('.ck-editor__main').focus();
		}
	}
}

function waitForElm(selector: any) {
	return new Promise((resolve) => {
		if (document.querySelector(selector)) {
			return resolve(document.querySelector(selector));
		}

		const observer = new MutationObserver((mutations) => {
			if (document.querySelector(selector)) {
				resolve(document.querySelector(selector));
				observer.disconnect();
			}
		});

		observer.observe(document.body, {
			childList: true,
			subtree: true,
		});
	});
}

function escapeRegExp(str: string) {
	return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

function replaceAll(str: string, find: string, replace: string) {
	return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}
