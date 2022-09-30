import Vue from 'vue';
import { Completion, CompletionContext, CompletionResult } from '@codemirror/autocomplete';
import { addVarType } from '../utils';
import { escape } from '../utils';
import type { CodeNodeEditorMixin } from '../types';

export const executionCompletions = (Vue as CodeNodeEditorMixin).extend({
	methods: {
		/**
		 * Complete `$execution.` to `.id .mode .resumeUrl`
		 */
		executionCompletions(
			context: CompletionContext,
			matcher = '$execution',
		): CompletionResult | null {
			const pattern = new RegExp(`${escape(matcher)}\..*`);

			const preCursor = context.matchBefore(pattern);

			if (!preCursor || (preCursor.from === preCursor.to && !context.explicit)) return null;

			const options: Completion[] = [
				{
					label: `${matcher}.id`,
					info: this.$locale.baseText('codeNodeEditor.autocompleter.$execution.id'),
				},
				{
					label: `${matcher}.mode`,
					info: this.$locale.baseText('codeNodeEditor.autocompleter.$execution.mode'),
				},
				{
					label: `${matcher}.resumeUrl`,
					info: this.$locale.baseText('codeNodeEditor.autocompleter.$execution.resumeUrl'),
				},
			];

			return {
				from: preCursor.from,
				options: options.map(addVarType),
			};
		},
	},
});
