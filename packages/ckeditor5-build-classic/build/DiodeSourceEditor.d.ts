import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
export default class DiodeSourceEditor extends Plugin {
    isSourceEditingMode: boolean;
    sourceEditor: any;
    editorElement: any;
    init(): void;
    /**
     * Disables all commands.
     *
     * @private
     */
    _disableCommands(): void;
    addSourceEditor(): Promise<void>;
    /**
     * Clears forced disable for all commands, that was previously set through {@link #_disableCommands}.
     *
     * @private
     */
    _enableCommands(): void;
}
