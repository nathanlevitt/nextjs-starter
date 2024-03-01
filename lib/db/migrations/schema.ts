import { mysqlTable, mysqlSchema, AnyMySqlColumn, primaryKey, unique, serial, int, varchar, datetime } from "drizzle-orm/mysql-core"
import { sql } from "drizzle-orm"


export const sessions = mysqlTable("sessions", {
	id: serial("id").notNull(),
	userId: int("userId").notNull(),
	token: varchar("token", { length: 512 }).notNull(),
	expiresAt: datetime("expiresAt", { mode: 'string'}).notNull(),
},
(table) => {
	return {
		sessionsId: primaryKey({ columns: [table.id], name: "sessions_id"}),
		id: unique("id").on(table.id),
		userTokenIdx: unique("user_token_idx").on(table.userId, table.token),
	}
});

export const users = mysqlTable("users", {
	id: serial("id").notNull(),
	name: varchar("name", { length: 256 }).notNull(),
	email: varchar("email", { length: 256 }).notNull(),
	password: varchar("password", { length: 256 }),
},
(table) => {
	return {
		usersId: primaryKey({ columns: [table.id], name: "users_id"}),
		id: unique("id").on(table.id),
		emailIdx: unique("email_idx").on(table.email),
	}
});