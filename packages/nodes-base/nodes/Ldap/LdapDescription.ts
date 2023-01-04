import { INodeProperties } from 'n8n-workflow';

export const ldapFields: INodeProperties[] = [
	// ----------------------------------
	//         Common
	// ----------------------------------
	{
		displayName: 'DN',
		name: 'dn',
		type: 'string',
		default: '',
		required: true,
		typeOptions: {
			alwaysOpenEditWindow: false,
		},
		displayOptions: {
			show: {
				operation: ['compare', 'create', 'delete', 'rename', 'modify'],
			},
		},
		description: 'The distinguished name of the entry',
	},
	// ----------------------------------
	//         Compare
	// ----------------------------------
	{
		// eslint-disable-next-line n8n-nodes-base/node-param-display-name-wrong-for-dynamic-options
		displayName: 'Attribute ID',
		name: 'id',
		type: 'options',
		required: true,
		default: [],
		typeOptions: {
			loadOptionsMethod: 'getAttributesForDn',
		},
		// eslint-disable-next-line n8n-nodes-base/node-param-description-wrong-for-dynamic-options
		description: 'The ID of the attribute to compare',
		displayOptions: {
			show: {
				operation: ['compare'],
			},
		},
	},
	{
		displayName: 'Value',
		name: 'value',
		type: 'string',
		default: '',
		description: 'The value to compare',
		displayOptions: {
			show: {
				operation: ['compare'],
			},
		},
	},
	// ----------------------------------
	//         Rename
	// ----------------------------------
	{
		displayName: 'Target DN',
		name: 'targetDn',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				operation: ['rename'],
			},
		},
		description: 'The new distinguished name for the entry',
	},
	// ----------------------------------
	//         Create
	// ----------------------------------
	{
		displayName: 'Attributes',
		name: 'attributes',
		placeholder: 'Add Attributes',
		description: 'Add attributes to an object',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		displayOptions: {
			show: {
				operation: ['create'],
			},
		},
		default: {},
		options: [
			{
				name: 'attribute',
				displayName: 'Attribute',
				values: [
					{
						displayName: 'Attribute ID',
						name: 'id',
						type: 'string',
						default: '',
						description: 'The ID of the attribute to add',
						required: true,
					},
					{
						displayName: 'Value',
						name: 'value',
						type: 'string',
						default: '',
						description: 'Value of the attribute to set',
					},
				],
			},
		],
	},
	// ----------------------------------
	//         Modify
	// ----------------------------------
	{
		displayName: 'Modify Attribute',
		name: 'attributes',
		placeholder: 'Modify Attribute',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
			sortable: true,
		},
		displayOptions: {
			show: {
				operation: ['modify'],
			},
		},
		description: 'Modify object attributes',
		default: {},
		options: [
			{
				name: 'add',
				displayName: 'Add',
				values: [
					{
						displayName: 'Attribute ID',
						name: 'id',
						type: 'string',
						default: '',
						description: 'The ID of the attribute to add',
						required: true,
					},
					{
						displayName: 'Value',
						name: 'value',
						type: 'string',
						default: '',
						description: 'Value of the attribute to set',
					},
				],
			},
			{
				name: 'replace',
				displayName: 'Replace',
				values: [
					{
						displayName: 'Attribute ID',
						name: 'id',
						type: 'string',
						default: '',
						description: 'The ID of the attribute to replace',
						required: true,
					},
					{
						displayName: 'Value',
						name: 'value',
						type: 'string',
						default: '',
						description: 'Value of the attribute to replace',
					},
				],
			},
			{
				name: 'delete',
				displayName: 'Remove',
				values: [
					{
						displayName: 'Attribute ID',
						name: 'id',
						type: 'string',
						default: '',
						description: 'The ID of the attribute to remove',
						required: true,
					},
					{
						displayName: 'Value',
						name: 'value',
						type: 'string',
						default: '',
						description: 'Value of the attribute to remove',
					},
				],
			},
		],
	},
	// ----------------------------------
	//         Search
	// ----------------------------------
	{
		displayName: 'Base DN',
		name: 'baseDN',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				operation: ['search'],
			},
		},
		description: 'The distinguished name of the subtree to search in',
	},
	{
		// eslint-disable-next-line n8n-nodes-base/node-param-display-name-wrong-for-dynamic-options
		displayName: 'Search For',
		name: 'searchFor',
		type: 'options',
		default: [],
		typeOptions: {
			loadOptionsMethod: 'getObjectClasses',
		},
		displayOptions: {
			show: {
				operation: ['search'],
			},
		},
		// eslint-disable-next-line n8n-nodes-base/node-param-description-wrong-for-dynamic-options
		description: 'LDAP objects to search for',
	},
	{
		displayName: 'Custom Filter',
		name: 'customFilter',
		type: 'string',
		default: '(objectclass=*)',
		displayOptions: {
			show: {
				operation: ['search'],
				searchFor: ['custom'],
			},
		},
		description: 'Custom LDAP filter. Escape these chars * ( ) \\ with a backslash "\\".',
	},
	{
		// eslint-disable-next-line n8n-nodes-base/node-param-display-name-wrong-for-dynamic-options
		displayName: 'Attribute',
		name: 'attribute',
		type: 'options',
		required: true,
		default: [],
		typeOptions: {
			loadOptionsMethod: 'getAttributes',
		},
		// eslint-disable-next-line n8n-nodes-base/node-param-description-wrong-for-dynamic-options
		description: 'Attribute to search for',
		displayOptions: {
			show: {
				operation: ['search'],
			},
			hide: {
				searchFor: ['custom'],
			},
		},
	},
	{
		displayName: 'Search Text',
		name: 'searchText',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				operation: ['search'],
			},
			hide: {
				searchFor: ['custom'],
			},
		},
		description: 'Text to search for, Use * for a wildcard',
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		description: 'Whether to return all results or only up to a given limit',
		displayOptions: {
			show: {
				operation: ['search'],
			},
		},
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		default: 50,
		description: 'Max number of results to return',
		typeOptions: {
			minValue: 1,
		},
		displayOptions: {
			show: {
				operation: ['search'],
				returnAll: [false],
			},
		},
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				operation: ['search'],
			},
		},
		options: [
			{
				displayName: 'Attributes',
				name: 'attributes',
				type: 'string',
				default: '',
				description: 'Comma-separated list of attributes to return',
			},
			{
				displayName: 'Page Size',
				name: 'pageSize',
				type: 'number',
				default: 1000,
				typeOptions: {
					minValue: 0,
				},
				description:
					'Maximum number of results to request at one time. Set to 0 to disable paging.',
			},
			{
				displayName: 'Scope',
				name: 'scope',
				default: 'sub',
				description:
					'The set of entries at or below the BaseDN that may be considered potential matches',
				type: 'options',
				options: [
					{
						name: 'Base Object',
						value: 'base',
					},
					{
						name: 'Single Level',
						value: 'one',
					},
					{
						name: 'Whole Subtree',
						value: 'sub',
					},
				],
			},
		],
	},
];
