import type { ElMessageBoxOptions, Action, MessageBoxInputData } from 'element-plus';
import { ElMessageBox as MessageBox } from 'element-plus';
import { sanitizeInput } from '@/utils/htmlUtils';

export type MessageBoxConfirmResult = 'confirm' | 'cancel';

export function useMessage() {
	const handleCancelOrClose = (e: Action | Error): Action => {
		if (e instanceof Error) throw e;

		return e;
	};

	const handleCancelOrClosePrompt = (e: Error | Action): MessageBoxInputData => {
		if (e instanceof Error) throw e;

		return { value: '', action: e };
	};

	async function alert(
		message: ElMessageBoxOptions['message'],
		configOrTitle?: string | ElMessageBoxOptions,
		config?: ElMessageBoxOptions,
	) {
		const resolvedConfig = {
			...(config ?? (typeof configOrTitle === 'object' ? configOrTitle : {})),
			cancelButtonClass: 'btn--cancel',
			confirmButtonClass: 'btn--confirm',
		};

		if (typeof configOrTitle === 'string') {
			return await MessageBox.alert(sanitizeInput(message), configOrTitle, resolvedConfig).catch(
				handleCancelOrClose,
			);
		}
		return await MessageBox.alert(sanitizeInput(message), resolvedConfig).catch(
			handleCancelOrClose,
		);
	}

	async function confirm(
		message: ElMessageBoxOptions['message'],
		configOrTitle?: string | ElMessageBoxOptions,
		config?: ElMessageBoxOptions,
	) {
		const resolvedConfig = {
			cancelButtonClass: 'btn--cancel',
			confirmButtonClass: 'btn--confirm',
			distinguishCancelAndClose: true,
			showClose: config?.showClose ?? false,
			closeOnClickModal: false,
			...(config ?? (typeof configOrTitle === 'object' ? configOrTitle : {})),
		};

		if (typeof configOrTitle === 'string') {
			return await MessageBox.confirm(
				sanitizeInput(message),
				sanitizeInput(configOrTitle),
				resolvedConfig,
			).catch(handleCancelOrClose);
		}

		return await MessageBox.confirm(sanitizeInput(message), resolvedConfig).catch(
			handleCancelOrClose,
		);
	}

	async function prompt(
		message: ElMessageBoxOptions['message'],
		configOrTitle?: string | ElMessageBoxOptions,
		config?: ElMessageBoxOptions,
	) {
		const resolvedConfig = {
			...(config ?? (typeof configOrTitle === 'object' ? configOrTitle : {})),
			cancelButtonClass: 'btn--cancel',
			confirmButtonClass: 'btn--confirm',
		};

		if (typeof configOrTitle === 'string') {
			return await MessageBox.prompt(
				sanitizeInput(message),
				sanitizeInput(configOrTitle),
				resolvedConfig,
			).catch(handleCancelOrClosePrompt);
		}
		return await MessageBox.prompt(sanitizeInput(message), resolvedConfig).catch(
			handleCancelOrClosePrompt,
		);
	}

	return {
		alert,
		confirm,
		prompt,
		message: MessageBox,
	};
}
