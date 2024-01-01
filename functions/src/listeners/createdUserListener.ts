import * as functions from 'firebase-functions';
import { Pool } from 'pg';
import { pool } from '../db/db';
import { UserRecord, getAuth } from 'firebase-admin/auth';

export const onUserCreated = functions.auth.user().onCreate(async (user) => {
  await addUserToDB(pool, user);
  await addUserJournal(pool, user);

  // Give user default permissions
  const defaultRole = { role: 'user' };
  await getAuth().setCustomUserClaims(user.uid, defaultRole);
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

const addUserJournal = async (pool: Pool, user: UserRecord) => {
  try {
    // Create a new journal entry and link it to user
    const tableName = 'journals';
    const tableColumns = ['user_id', 'name'].join(',');

    const query = `INSERT INTO ${tableName} (${tableColumns}) VALUES ('${user.uid}', NULL)`;
    await pool.query(query);
  } catch (err) {
    console.log(err);
  }
};
