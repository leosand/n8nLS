import { SETTINGS_STORE_DEFAULT_STATE, waitAllPromises } from '@/__tests__/utils';
import { ROLE, STORES } from '@/constants';
import { createTestingPinia } from '@pinia/testing';
import CollaborationPane from '@/components//MainHeader/CollaborationPane.vue';
import type { RenderOptions } from '@/__tests__/render';
import { createComponentRenderer } from '@/__tests__/render';

const OWNER_USER = {
	createdAt: '2023-11-22T10:17:12.246Z',
	id: 'aaaaaa',
	email: 'owner@user.com',
	firstName: 'Owner',
	lastName: 'User',
	role: ROLE.Owner,
	disabled: false,
	isPending: false,
	fullName: 'Owner User',
};

const MEMBER_USER = {
	createdAt: '2023-11-22T10:17:12.246Z',
	id: 'aaabbb',
	email: 'member@user.com',
	firstName: 'Member',
	lastName: 'User',
	role: ROLE.Member,
	disabled: false,
	isPending: false,
	fullName: 'Member User',
};

const MEMBER_USER_2 = {
	createdAt: '2023-11-22T10:17:12.246Z',
	id: 'aaaccc',
	email: 'member2@user.com',
	firstName: 'Another Member',
	lastName: 'User',
	role: ROLE.Member,
	disabled: false,
	isPending: false,
	fullName: 'Another Member User',
};

const initialState = {
	[STORES.SETTINGS]: SETTINGS_STORE_DEFAULT_STATE,
	[STORES.WORKFLOWS]: {
		workflow: {
			id: 'w1',
		},
	},
	[STORES.USERS]: {
		currentUserId: OWNER_USER.id,
		usersById: {
			[OWNER_USER.id]: OWNER_USER,
			[MEMBER_USER.id]: MEMBER_USER,
			[MEMBER_USER_2.id]: MEMBER_USER_2,
		},
	},
	[STORES.COLLABORATION]: {
		collaborators: [
			{ lastSeen: '2023-11-22T10:17:12.246Z', user: MEMBER_USER },
			{ lastSeen: '2023-11-22T10:17:12.246Z', user: OWNER_USER },
		],
	},
};

const defaultRenderOptions: RenderOptions = {
	pinia: createTestingPinia({ initialState }),
};

const renderComponent = createComponentRenderer(CollaborationPane, defaultRenderOptions);

describe('CollaborationPane', () => {
	afterEach(() => {
		vi.clearAllMocks();
	});

	it('should show only current workflow users', async () => {
		const { getByTestId, queryByTestId } = renderComponent();
		await waitAllPromises();

		expect(getByTestId('collaboration-pane')).toBeInTheDocument();
		expect(getByTestId('user-stack-avatars')).toBeInTheDocument();
		expect(getByTestId(`user-stack-avatar-${OWNER_USER.id}`)).toBeInTheDocument();
		expect(getByTestId(`user-stack-avatar-${MEMBER_USER.id}`)).toBeInTheDocument();
		expect(queryByTestId(`user-stack-avatar-${MEMBER_USER_2.id}`)).toBeNull();
	});

	it('should always render the current user first in the list', async () => {
		const { getByTestId } = renderComponent();
		await waitAllPromises();

		const firstAvatar = getByTestId('user-stack-avatars').querySelector('.n8n-avatar');
		// Owner is second in the store but should be rendered first
		expect(firstAvatar).toHaveAttribute('data-test-id', `user-stack-avatar-${OWNER_USER.id}`);
	});

	it('should not render the user-stack if there is only one user', async () => {
		const { getByTestId } = renderComponent({
			pinia: createTestingPinia({
				initialState: {
					...initialState,
					[STORES.COLLABORATION]: {
						collaborators: [{ lastSeen: '2023-11-22T10:17:12.246Z', user: OWNER_USER }],
					},
				},
			}),
		});
		await waitAllPromises();

		const collaborationPane = getByTestId('collaboration-pane');
		expect(collaborationPane).toBeInTheDocument();
		expect(collaborationPane.querySelector('[data-test-id=user-stack-avatars]')).toBeNull();
	});
});
