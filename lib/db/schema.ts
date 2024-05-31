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

export interface UserTable extends BaseTable {
  id: Generated<number>;
  email: string;
  username: string;
  name: string | null;
  password: string;
  avatar: string | null;
}

export type User = Selectable<UserTable>;
export type NewUser = Insertable<UserTable>;
export type UpdateUser = Updateable<UserTable>;

export interface SessionTable extends BaseTable {
  id: Generated<string>;
  userId: number;
  expiresAt: Date;
}

export type Session = Selectable<SessionTable>;
export type NewSession = Insertable<SessionTable>;

export interface PasswordResetTokenTable extends BaseTable {
  id: Generated<string>;
  userId: number;
  expiresAt: Date;
}

export type PasswordResetToken = Selectable<PasswordResetTokenTable>;
export type NewPasswordResetToken = Insertable<PasswordResetTokenTable>;

export interface Database {
  users: UserTable;
  sessions: SessionTable;
  passwordResetTokens: PasswordResetTokenTable;
}
