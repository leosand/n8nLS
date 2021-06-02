import {
	INodeProperties,
} from 'n8n-workflow';

export const cloneFields = [
	{
		displayName: 'Repository',
		name: 'repositoryPath',
		type: 'string',
		displayOptions: {
			show: {
				operation: [
					'clone',
				],
			},
		},
		default: '',
		placeholder: 'https://github.com/n8n-io/n8n',
		description: 'The URL or path of the repository to clone.',
		required: true,
	},
] as INodeProperties[];
