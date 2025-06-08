import {
  Generated,
  ColumnType,
  Selectable,
  Insertable,
  Updateable,
} from "kysely";

export interface BaseTable {
  createdAt: ColumnType<Date, string | undefined, never>;
  updatedAt: ColumnType<Date | null, string | undefined, never>;
}

export type UserRole = "admin" | "manager" | "support" | "customer";

export interface UsersTable extends BaseTable {
  id: Generated<string>;
  email: string;
  username: string;
  name: string | null;
  password: string;
  avatar: string | null;
  role: ColumnType<UserRole, UserRole | undefined, UserRole | undefined>;
}

export type User = Selectable<UsersTable>;
export type NewUser = Insertable<UsersTable>;
export type UpdateUser = Updateable<UsersTable>;

export interface SessionsTable extends BaseTable {
  id: Generated<string>;
  token: string;
  userId: string;
  ipAddress: string | null;
  userAgent: string | null;
  expiresAt: ColumnType<Date, Date, Date>;
}

export type Session = Selectable<SessionsTable>;
export type NewSession = Insertable<SessionsTable>;
export type UpdateSession = Updateable<SessionsTable>;

export type SecurityTokenType =
  | "email_verification"
  | "password_reset"
  | "two_factor_authentication";

export interface SecurityTokensTable extends Pick<BaseTable, "createdAt"> {
  id: Generated<string>;
  userId: string;
  token: string;
  type: ColumnType<
    SecurityTokenType,
    SecurityTokenType,
    SecurityTokenType | undefined
  >;
  expiresAt: ColumnType<Date, Date, never>;
}

export type SecurityToken = Selectable<SecurityTokensTable>;
export type NewSecurityToken = Insertable<SecurityTokensTable>;

export interface Database {
  users: UsersTable;
  sessions: SessionsTable;
  securityTokens: SecurityTokensTable;
}
