import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import SourceIcon from '@ckeditor/ckeditor5-source-editing/theme/icons/source-editing.svg';

const COMMAND_FORCE_DISABLE_ID = 'SourceEditingMode';

export default class DiodeUploadAdapter {
	xhr: any;
	upload() {}
	abort() {
		if (this.xhr) {
			this.xhr.abort();
		}
	}
}
