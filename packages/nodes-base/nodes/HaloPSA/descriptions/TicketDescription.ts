import { INodeProperties } from 'n8n-workflow';

export const ticketOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['ticket'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a ticket',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a ticket',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a ticket',
			},
			{
				name: 'Get All',
				value: 'getAll',
				description: 'Get all tickets',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a ticket',
			},
		],
		default: 'delete',
	},
];

export const ticketFields: INodeProperties[] = [
	/* -------------------------------------------------------------------------- */
	/*                                ticket:create                               */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Ticket Type',
		name: 'ticketType',
		type: 'options',
		default: '',
		required: true,
		typeOptions: {
			loadOptionsMethod: 'getHaloPSATicketsTypes',
		},
		displayOptions: {
			show: {
				resource: ['ticket'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Summary',
		name: 'summary',
		type: 'string',
		default: '',
		placeholder: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['ticket'],
				operation: ['create'],
			},
		},
		description: 'Enter summary',
	},
	{
		displayName: 'Details',
		name: 'details',
		type: 'string',
		default: '',
		placeholder: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['ticket'],
				operation: ['create'],
			},
		},
		description: 'Enter details',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		default: {},
		placeholder: 'Add Field',
		displayOptions: {
			show: {
				resource: ['ticket'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Assigned Agent Name/ID',
				name: 'agent_id',
				type: 'options',
				default: '',
				typeOptions: {
					loadOptionsMethod: 'getHaloPSAAgents',
				},
			},
			{
				displayName: 'Start Date',
				name: 'startdate',
				type: 'dateTime',
				default: '',
			},
			{
				displayName: 'Target Date',
				name: 'targetdate',
				type: 'dateTime',
				default: '',
			},
		],
	},
	/* -------------------------------------------------------------------------- */
	/*                                site:get                                    */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Ticket ID',
		name: 'ticketId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['ticket'],
				operation: ['delete', 'get'],
			},
		},
	},

	{
		displayName: 'Simplify Output',
		name: 'simplify',
		type: 'boolean',
		default: true,
		description: 'Whether output should be simplified',
		displayOptions: {
			show: {
				resource: ['ticket'],
				operation: ['get', 'getAll'],
			},
		},
	},
	/* -------------------------------------------------------------------------- */
	/*                                ticket:getAll                               */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['ticket'],
				operation: ['getAll'],
			},
		},
		default: false,
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		default: 50,
		displayOptions: {
			show: {
				resource: ['ticket'],
				operation: ['getAll'],
				returnAll: [false],
			},
		},
		typeOptions: {
			minValue: 1,
			maxValue: 1000,
		},
		description: 'Max number of results to return',
	},
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		default: {},
		placeholder: 'Add Field',
		displayOptions: {
			show: {
				resource: ['ticket'],
				operation: ['getAll'],
			},
		},
		options: [
			{
				displayName: 'Active status',
				name: 'activeStatus',
				type: 'options',
				default: 'includeactive',
				options: [
					{
						name: 'Active only',
						value: 'active',
						description: 'Whether to include active customers in the response',
					},
					{
						name: 'All',
						value: 'all',
						description: 'Whether to include active and inactive customers in the response',
					},
					{
						name: 'Inactive only',
						value: 'inactive',
						description: 'Whether to include inactive Customers in the responsee',
					},
				],
			},
			{
				displayName: 'Text To Filter By',
				name: 'search',
				type: 'string',
				default: '',
				description: 'Filter tickets by your search string',
			},
		],
	},
	/* -------------------------------------------------------------------------- */
	/*                                ticket:update                               */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Ticket ID',
		name: 'ticketId',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['ticket'],
				operation: ['update'],
			},
		},
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		default: {},
		placeholder: 'Add Field',
		displayOptions: {
			show: {
				resource: ['ticket'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Assigned Agent Name/ID',
				name: 'agent_id',
				type: 'options',
				default: '',
				typeOptions: {
					loadOptionsMethod: 'getHaloPSAAgents',
				},
			},
			{
				displayName: 'Details',
				name: 'details',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Start Date',
				name: 'startdate',
				type: 'dateTime',
				default: '',
			},
			{
				displayName: 'Summary',
				name: 'summary',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Target Date',
				name: 'targetdate',
				type: 'dateTime',
				default: '',
			},
		],
	},
];
