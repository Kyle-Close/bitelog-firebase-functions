import * as functions from 'firebase-functions';
import { Pool } from 'pg';
import { pool } from '../db/db';
import { UserRecord } from 'firebase-admin/auth';

export const onUserCreated = functions.auth.user().onCreate(async (user) => {
  // Your code to run when a user is created
  console.log(`User created: ${user.uid}`);

  await addUserToDB(pool, user);
});

const addUserToDB = async (pool: Pool, user: UserRecord) => {
  try {
    const tableName = 'Users';
    const columns = 'id, username, email, created_on';

    const { uid, displayName, email } = user;
    const values = `'${uid}', '${displayName}', '${email}', NOW()`;

    const query = `INSERT INTO ${tableName} (${columns}) VALUES (${values})`;
    console.log('Query:', query);

    const response = await pool.query(query);

    if (response) {
      console.log('Insert successful');
    }
  } catch (err) {
    console.error('Error in addUserToDB:', err);
  }
};
