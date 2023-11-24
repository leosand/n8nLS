import { useUsersStore } from '@/stores/users.store';
import type { RBACPermissionCheck, RolePermissionOptions } from '@/types/rbac';
import { ROLE } from '@/utils';
import type { IRole } from '@/Interface';

export const hasRole: RBACPermissionCheck<RolePermissionOptions> = (checkRoles) => {
	const usersStore = useUsersStore();
	const currentUser = usersStore.currentUser;

	if (currentUser && checkRoles) {
		const userRole = currentUser.isDefaultUser ? ROLE.Default : currentUser.globalRole?.name;
		return checkRoles.includes(userRole as IRole);
	}

	return false;
};
