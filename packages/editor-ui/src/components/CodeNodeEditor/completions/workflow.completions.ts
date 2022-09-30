import Vue from 'vue';
import { Completion, CompletionContext, CompletionResult } from '@codemirror/autocomplete';
import { addVarType } from '../utils';
import type { CodeNodeEditorMixin } from '../types';

const DEFAULT_MATCHER = '$workflow';

const escape = (str: string) => str.replace('$', '\\$');

export const workflowCompletions = (Vue as CodeNodeEditorMixin).extend({
	methods: {
		/**
		 * Complete `$workflow.` to `.id .name .active`.
		 */
		workflowCompletions(
			context: CompletionContext,
			matcher = DEFAULT_MATCHER,
		): CompletionResult | null {
			const pattern = new RegExp(`${escape(matcher)}\..*`);

			const preCursor = context.matchBefore(pattern);

			if (!preCursor || (preCursor.from === preCursor.to && !context.explicit)) return null;

			const options: Completion[] = [
				{
					label: `${matcher}.id`,
					info: this.$locale.baseText('codeNodeEditor.autocompleter.$workflow.id'),
				},
				{
					label: `${matcher}.name`,
					info: this.$locale.baseText('codeNodeEditor.autocompleter.$workflow.name'),
				},
				{
					label: `${matcher}.active`,
					info: this.$locale.baseText('codeNodeEditor.autocompleter.$workflow.active'),
				},
			];

			return {
				from: preCursor.from,
				options: options.map(addVarType),
			};
		},
	},
});
