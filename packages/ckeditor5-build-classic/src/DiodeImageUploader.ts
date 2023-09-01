import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import ImageIcon from '@ckeditor/ckeditor5-core/theme/icons/image.svg';

export default class DiodeImageUploader extends Plugin {
	init() {
		const editor = this.editor;
		console.log('init DiodeImageUploader');

		editor.ui.componentFactory.add('diodeImageUploader', (locale) => {
			const button = new ButtonView(locale);
			button.set({
				label: 'Insert Image',
				icon: ImageIcon,
				tooltip: true,
			});

			// @ts-ignore
			editor.diodeImageUploaderButton = button;

			// Callback executed once the image is clicked.
			button.on('execute', () => {
				// @ts-ignore
				if (editor.hook) {
					// @ts-ignore
					editor.currentPosition =
						editor.model.document.selection.getFirstPosition();
					// @ts-ignore
					console.log('diodeImageUploader', editor.currentPosition);
					// @ts-ignore
					editor.hook.pushEventTo(editor.hook.el, 'choose_image');
				}
			});

			return button;
		});
	}
}
