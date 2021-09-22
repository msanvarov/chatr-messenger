import cors from 'cors';
import admin from 'firebase-admin';
import functions from 'firebase-functions';

const CORS = cors({
  origin: true,
});

admin.initializeApp();

const auth = admin.auth();

export const fetchUsers = functions.https.onRequest((request, response) => {
  return CORS(request, response, async () => {
    const { batchToken } = request.body;
    functions.logger.info(`Fetching users`, { structuredData: true });
    const batchListUsers = async (nextPageToken?: string) => {
      try {
        const { users, pageToken } = await auth.listUsers(1000, nextPageToken);
        const sanitizedResponse = users.map(
          ({ uid, displayName, photoURL, email }) => ({
            uid,
            displayName,
            photoURL,
            email,
          })
        );
        if (pageToken) {
          response
            .status(200)
            .send({ users: sanitizedResponse, batchToken: pageToken });
        }
        response.status(200).send({ users: sanitizedResponse });
      } catch (error) {
        functions.logger.error(error.message, { structuredData: true });
      }
    };
    if (batchToken) {
      await batchListUsers(batchToken);
    }
    await batchListUsers();
  });
});
