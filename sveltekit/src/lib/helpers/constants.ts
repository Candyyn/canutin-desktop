export const ONE_SECOND_IN_MS = 1000;
export const ACCESS_KEY_COOKIE_NAME = '_canutin-accessKey=';
export const UNAUTHORIZED_RESPONSE_MESSAGE = 'Unauthorized';
export const UNAUTHORIZED_RESPONSE_STATUS = { status: 401 };
export const UNDOABLE_ACTION = "🚩 This action can't be undone\n";

export enum BalanceGroup {
	CASH,
	DEBT,
	INVESTMENTS,
	OTHER_ASSETS
}

export const getBalanceGroupLabel = (balanceGroup: BalanceGroup) => {
	switch (balanceGroup) {
		case BalanceGroup.CASH:
			return 'Cash';
		case BalanceGroup.DEBT:
			return 'Debt';
		case BalanceGroup.INVESTMENTS:
			return 'Investments';
		case BalanceGroup.OTHER_ASSETS:
			return 'Other assets';
	}
};

export enum Appearance {
	ACTIVE = 'active',
	POSITIVE = 'positive',
	NEGATIVE = 'negative',
	WARNING = 'warning'
}

export enum SortOrder {
	DESC = 'desc',
	ASC = 'asc'
}

export enum TrailingCashflowPeriods {
	LAST_6_MONTHS = 'Last 6 months',
	LAST_12_MONTHS = 'Last 12 months'
}

export enum EventFrequency {
	NEVER = 'Never',
	ONCE_AN_HOUR = 'Once an hour',
	ONCE_A_DAY = 'Once a day',
	ONCE_A_WEEK = 'Once a week',
	ONCE_A_MONTH = 'Once a month',
	TWICE_AN_HOUR = 'Twice a hour',
	TWICE_A_DAY = 'Twice a day',
	TWICE_A_WEEK = 'Twice a week',
	TWICE_A_MONTH = 'Twice a month'
}

export enum Currency {
    USD = 'USD',
    EUR = 'EUR',
    GBP = 'GBP',
    CHF = 'CHF',
    CAD = 'CAD',
    AUD = 'AUD',
    JPY = 'JPY',
    CNY = 'CNY',
    SEK = 'SEK',
    NOK = 'NOK',
    DKK = 'DKK',
}

export enum DeveloperFunctions {
	DB_WIPE,
	DB_WIPE_ACCOUNTS_ASSETS,
	DB_WIPE_TRANSACTIONS,
	DB_SEED,
	DB_SET_URL,
	SET_ENV_VARIABLE,
	CANUTIN_FILE_SYNC_TEST
}

export enum SyncSettings {
    SYNC_ENABLED = 'SYNC_ENABLED',
    SYNC_URL = 'SYNC_URL',
    SYNC_FREQUENCY = 'SYNC_FREQUENCY',
    SYNC_COOKIE = 'SYNC_COOKIE',
    SYNC_JWT = 'SYNC_JWT'
}

export enum AccessKeySettings {
    ACCESS_KEY = 'ACCESS_KEY'
}

export enum EventStatus {
    READ = 'read',
    UNREAD = 'unread',
    ONGOING = 'ongoing'
}
