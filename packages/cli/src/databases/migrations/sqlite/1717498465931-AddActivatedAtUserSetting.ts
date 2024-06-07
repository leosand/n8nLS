import type { MigrationContext } from '@/databases/types';
import { AddActivatedAtUserSetting1717498465931 as BaseMigration } from '../common/1717498465931-AddActivatedAtUserSetting';

export class AddActivatedAtUserSetting1717498465931 extends BaseMigration {
	transaction = false as const;

	async up({ queryRunner, escape }: MigrationContext) {
		const now = Date.now();
		await queryRunner.query(
			`UPDATE ${escape.tableName('user')}
			SET settings = JSON_SET(settings, '$.userActivatedAt', ${now})
			WHERE JSON_EXTRACT(settings, '$.userActivated') = true;`,
		);
	}

	async down({ queryRunner, escape }: MigrationContext) {
		await queryRunner.query(
			`UPDATE ${escape.tableName('user')} SET settings = JSON_REMOVE(settings, '$.userActivatedAt')`,
		);
	}
}
