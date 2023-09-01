/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

// The editor creator to use.
import { ClassicEditor as ClassicEditorBase } from '@ckeditor/ckeditor5-editor-classic';

import { Essentials } from '@ckeditor/ckeditor5-essentials';
import { UploadAdapter } from '@ckeditor/ckeditor5-adapter-ckfinder';
import { Autoformat } from '@ckeditor/ckeditor5-autoformat';
import { Bold, Italic } from '@ckeditor/ckeditor5-basic-styles';
import { BlockQuote } from '@ckeditor/ckeditor5-block-quote';
import { CKBox } from '@ckeditor/ckeditor5-ckbox';
import { CKFinder } from '@ckeditor/ckeditor5-ckfinder';
import { EasyImage } from '@ckeditor/ckeditor5-easy-image';
import { Heading } from '@ckeditor/ckeditor5-heading';
import {
	Image,
	ImageCaption,
	ImageStyle,
	ImageToolbar,
	ImageUpload,
	PictureEditing,
} from '@ckeditor/ckeditor5-image';
import { Indent } from '@ckeditor/ckeditor5-indent';
import { Link } from '@ckeditor/ckeditor5-link';
// import Link from '../../ckeditor5-link/src/link';
import { List } from '@ckeditor/ckeditor5-list';
import { MediaEmbed } from '@ckeditor/ckeditor5-media-embed';
import { Paragraph } from '@ckeditor/ckeditor5-paragraph';
import { PasteFromOffice } from '@ckeditor/ckeditor5-paste-from-office';
import { Table, TableToolbar } from '@ckeditor/ckeditor5-table';
import { TextTransformation } from '@ckeditor/ckeditor5-typing';
import { CloudServices } from '@ckeditor/ckeditor5-cloud-services';

// import Alignment from '@ckeditor/ckeditor5-alignment/src/alignment'; // <--- ADDED
import Markdown from '@ckeditor/ckeditor5-markdown-gfm/src/markdown';
import DiodeImageUploader from './DiodeImageUploader';
import DiodeSourceEditor from './DiodeSourceEditor';
import AutoSave from '@ckeditor/ckeditor5-autosave/src/autosave';
import { Range } from '@ckeditor/ckeditor5-engine';
import viewToPainText from '@ckeditor/ckeditor5-clipboard/src/utils/viewtoplaintext';

// @ts-ignore
export default class ClassicEditor extends ClassicEditorBase {
	public static override builtinPlugins = [
		Essentials,
		UploadAdapter,
		Autoformat,
		Bold,
		Italic,
		BlockQuote,
		CKBox,
		CKFinder,
		CloudServices,
		EasyImage,
		Heading,
		Image,
		ImageCaption,
		ImageStyle,
		ImageToolbar,
		ImageUpload,
		Indent,
		Link,
		List,
		MediaEmbed,
		Paragraph,
		PasteFromOffice,
		PictureEditing,
		Table,
		TableToolbar,
		TextTransformation,

		TextTransformation,
		// Alignment,
		Markdown,
		DiodeImageUploader,
		DiodeSourceEditor,
		AutoSave,
	];

	public static override defaultConfig = {
		toolbar: {
			items: [
				'undo',
				'redo',
				'|',
				'heading',
				'|',
				'bold',
				'italic',
				'link',
				'|',
				// 'alignment',
				// '|',
				'bulletedList',
				'numberedList',
				'|',
				'outdent',
				'indent',
				'|',
				'diodeImageUploader',
				'blockQuote',
				'insertTable',
				'mediaEmbed',
				'|',
				'diodeSourceEditor',
				'emoji',
			],
		},
		image: {
			toolbar: [
				'imageStyle:inline',
				'imageStyle:block',
				'imageStyle:side',
				'|',
				'toggleImageCaption',
				'imageTextAlternative',
			],
		},
		table: {
			contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells'],
		},
		// This value must be kept in sync with the language defined in webpack.config.js.
		language: 'en',
		objects: {
			Range,
			viewToPainText,
		},
		link: {
			mode: 'automatic',
			callback: (url: string) => url.startsWith('diode://'),
			attributes: {
				target: '_blank',
			},
		},
	};
}

// @ts-ignore
ClassicEditor.viewToPainText = viewToPainText;
