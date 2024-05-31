-- UserTable schema
CREATE TABLE users (
  "id" SERIAL PRIMARY KEY,
  "email" VARCHAR(255) NOT NULL,
  "username" VARCHAR(255) NOT NULL,
  "name" VARCHAR(255),
  "password" VARCHAR(255) NOT NULL,
  "avatar" VARCHAR(255),
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT NULL
);

-- SessionTable schema
CREATE TABLE sessions (
  "id" VARCHAR(255) NOT NULL PRIMARY KEY,
  "userId" INTEGER NOT NULL REFERENCES users("id"),
  "expiresAt" TIMESTAMP NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT NULL
);

-- PasswordResetTokenTable schema
CREATE TABLE "passwordResetTokens" (
  "id" VARCHAR(40) NOT NULL PRIMARY KEY,
  "userId" INTEGER NOT NULL REFERENCES users("id"),
  "expiresAt" TIMESTAMP NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT NULL
);

-- Trigger function to update the updatedAt column
CREATE OR REPLACE FUNCTION "updateUpdatedAtColumn"()
RETURNS TRIGGER AS $$
BEGIN
  NEW."updatedAt" = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for each table to handle the updatedAt column
CREATE TRIGGER "updateUsersUpdatedAt"
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION "updateUpdatedAtColumn"();

CREATE TRIGGER "updateSessionsUpdatedAt"
BEFORE UPDATE ON sessions
FOR EACH ROW
EXECUTE FUNCTION "updateUpdatedAtColumn"();

CREATE TRIGGER "updatePasswordResetTokensUpdatedAt"
BEFORE UPDATE ON "passwordResetTokens"
FOR EACH ROW
EXECUTE FUNCTION "updateUpdatedAtColumn"();