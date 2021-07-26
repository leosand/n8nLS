import {
	tz,
} from 'moment-timezone';

import {
	INodeProperties,
} from 'n8n-workflow';

export const appointmentOperations = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		displayOptions: {
			show: {
				resource: [
					'appointment',
				],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create an appointment',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete an appointment',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Retrieve an appointment',
			},
			{
				name: 'Get All',
				value: 'getAll',
				description: 'Retrieve all appointments',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update an appointment',
			},
		],
		default: 'create',
	},
] as INodeProperties[];

export const appointmentFields = [
	// ----------------------------------------
	//           appointment: create
	// ----------------------------------------
	{
		displayName: 'Title',
		name: 'title',
		description: 'Title of the appointment',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: [
					'appointment',
				],
				operation: [
					'create',
				],
			},
		},
	},
	{
		displayName: 'Start Date',
		name: 'fromDate',
		description: 'Timestamp that denotes the start of appointment. Start date if this is an all-day appointment.',
		type: 'dateTime',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: [
					'appointment',
				],
				operation: [
					'create',
				],
			},
		},
	},
	{
		displayName: 'End Date',
		name: 'endDate',
		description: 'Timestamp that denotes the end of appointment. End date if this is an all-day appointment.',
		type: 'dateTime',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: [
					'appointment',
				],
				operation: [
					'create',
				],
			},
		},
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: [
					'appointment',
				],
				operation: [
					'create',
				],
			},
		},
		options: [
			{
				displayName: 'Attendees',
				name: 'appointment_attendees_attributes',
				type: 'multiOptions',
				default: [],
				typeOptions: {
					loadOptionsMethod: 'getUsers',
				},
				description: 'Attendees associated to the appointment',
			},
			{
				displayName: 'Creator ID',
				name: 'creater_id',
				type: 'options',
				default: '',
				typeOptions: {
					loadOptionsMethod: 'getUsers',
				},
				description: 'ID of the user who created the appointment',
			},
			{
				displayName: 'Latitude',
				name: 'latitude',
				type: 'string',
				default: '',
				description: 'Latitude of the location when you check in for an appointment',
			},
			{
				displayName: 'Location',
				name: 'location',
				type: 'string',
				default: '',
				description: 'Location of the appointment',
			},
			{
				displayName: 'Longitude',
				name: 'longitude',
				type: 'string',
				default: '',
				description: 'Longitude of the location when you check in for an appointment',
			},
			{
				displayName: 'Outcome ID',
				name: 'outcome_id',
				type: 'options',
				default: '',
				typeOptions: {
					loadOptionsMethod: 'getOutcomes',
				},
				description: 'ID of outcome of Appointment sales activity type',
			},
			{
				displayName: 'Targetable ID',
				name: 'targetable_id',
				type: 'string',
				default: '',
				description: 'ID of contact/account against whom appointment is created',
			},
			{
				displayName: 'Targetable Type',
				name: 'targetable_type',
				type: 'options',
				default: 'Contact',
				options: [
					{
						name: 'Contact',
						value: 'Contact',
					},
					{
						name: 'Deal',
						value: 'Deal',
					},
					{
						name: 'SalesAccount',
						value: 'SalesAccount',
					},
				],
			},
			{
				displayName: 'Time Zone',
				name: 'time_zone',
				type: 'options',
				default: '',
				description: 'Timezone that the appointment is scheduled in',
				options: tz.names().map(tz => ({ name: tz, value: tz })),
			},
		],
	},

	// ----------------------------------------
	//           appointment: delete
	// ----------------------------------------
	{
		displayName: 'Appointment ID',
		name: 'appointmentId',
		description: 'ID of the appointment to delete',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: [
					'appointment',
				],
				operation: [
					'delete',
				],
			},
		},
	},

	// ----------------------------------------
	//             appointment: get
	// ----------------------------------------
	{
		displayName: 'Appointment ID',
		name: 'appointmentId',
		description: 'ID of the appointment to retrieve',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: [
					'appointment',
				],
				operation: [
					'get',
				],
			},
		},
	},

	// ----------------------------------------
	//           appointment: getAll
	// ----------------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		description: 'Whether to return all results or only up to a given limit',
		displayOptions: {
			show: {
				resource: [
					'appointment',
				],
				operation: [
					'getAll',
				],
			},
		},
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		default: 50,
		description: 'How many results to return',
		typeOptions: {
			minValue: 1,
		},
		displayOptions: {
			show: {
				resource: [
					'appointment',
				],
				operation: [
					'getAll',
				],
				returnAll: [
					false,
				],
			},
		},
	},

	// ----------------------------------------
	//           appointment: update
	// ----------------------------------------
	{
		displayName: 'Appointment ID',
		name: 'appointmentId',
		description: 'ID of the appointment to update',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: [
					'appointment',
				],
				operation: [
					'update',
				],
			},
		},
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: [
					'appointment',
				],
				operation: [
					'update',
				],
			},
		},
		options: [
			{
				displayName: 'Attendees',
				name: 'appointment_attendees_attributes',
				type: 'multiOptions',
				default: '',
				typeOptions: {
					loadOptionsMethod: 'getUsers',
				},
				description: 'Attendees associated to the appointment',
			},
			{
				displayName: 'Creator ID',
				name: 'creater_id',
				type: 'options',
				default: [],
				typeOptions: {
					loadOptionsMethod: 'getUsers',
				},
				description: 'ID of the user who created the appointment',
			},
			{
				displayName: 'End Date',
				name: 'endDate',
				description: 'Timestamp that denotes the end of appointment. End date if this is an all-day appointment.',
				type: 'dateTime',
				default: '',
			},
			{
				displayName: 'Latitude',
				name: 'latitude',
				type: 'string',
				default: '',
				description: 'Latitude of the location when you check in for an appointment',
			},
			{
				displayName: 'Location',
				name: 'location',
				type: 'string',
				default: '',
				description: 'Location of the appointment',
			},
			{
				displayName: 'Longitude',
				name: 'longitude',
				type: 'string',
				default: '',
				description: 'Longitude of the location when you check in for an appointment',
			},
			{
				displayName: 'Outcome ID',
				name: 'outcome_id',
				type: 'options',
				default: '',
				typeOptions: {
					loadOptionsMethod: 'getOutcomes',
				},
				description: 'ID of outcome of Appointment sales activity type',
			},
			{
				displayName: 'Start Date',
				name: 'fromDate',
				description: 'Timestamp that denotes the start of appointment. Start date if this is an all-day appointment.',
				type: 'dateTime',
				default: '',
			},
			{
				displayName: 'Targetable ID',
				name: 'targetable_id',
				type: 'string',
				default: '',
				description: 'ID of contact/account against whom appointment is created',
			},
			{
				displayName: 'Targetable Type',
				name: 'targetable_type',
				type: 'options',
				default: 'Contact',
				options: [
					{
						name: 'Contact',
						value: 'Contact',
					},
					{
						name: 'Deal',
						value: 'Deal',
					},
					{
						name: 'SalesAccount',
						value: 'SalesAccount',
					},
				],
			},
			{
				displayName: 'Time Zone',
				name: 'time_zone',
				type: 'options',
				default: '',
				description: 'Timezone that the appointment is scheduled in',
				options: tz.names().map(tz => ({ name: tz, value: tz })),
			},
			{
				displayName: 'Title',
				name: 'title',
				type: 'string',
				default: '',
				description: 'Title of the appointment',
			},
		],
	},
] as INodeProperties[];
