import * as cors from 'cors';
import * as nodemailer from 'nodemailer';
import * as firebaseAdmin from 'firebase-admin';
import * as functions from 'firebase-functions';
import * as transport from 'nodemailer-smtp-transport';

const CORS = cors({
  origin: true,
});

firebaseAdmin.initializeApp();

const auth = firebaseAdmin.auth();

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

export const emailInvitation = functions.https.onRequest(
  (request, response) => {
    const { email, message, requestor } = request.body;
    functions.logger.info(`Mailing to ${email} from ${requestor}`, {
      structuredData: true,
    });
    return CORS(request, response, () => {
      const htmlEmailBody = `<!doctype html>
      <html lang="en">
      
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>%APP_NAME% - Chat and Discussion Platform</title>
      
        <!-- Favicon -->
        <link rel="icon"
          href="https://firebasestorage.googleapis.com/v0/b/react-chatr.appspot.com/o/favicon.png?alt=media&token=7aac43e3-c1dc-4c11-8a54-0b7f2ca0ec8e"
          type="image/png">
        <style>
          html,
          body {
            padding: 0;
            margin: 0;
          }
      
        </style>
      </head>
      
      <body class="text-center">
      
        <div class="row">
          <div class="col-md-12">
            <table class="body-wrap"
              style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; width: 100%; background-color: #eaf0f7; margin: 0;"
              bgcolor="#eaf0f7">
              <tr
                style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
                <td
                  style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0;"
                  valign="top"></td>
                <td class="container" width="600"
                  style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; display: block !important; max-width: 600px !important; clear: both !important; margin: 0 auto;"
                  valign="top">
                  <div class="content"
                    style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; max-width: 600px; display: block; margin: 0 auto; padding: 50px; 0">
                    <table class="main" width="100%" cellpadding="0" cellspacing="0" itemprop="action" itemscope
                      itemtype="http://schema.org/ConfirmAction"
                      style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; border-radius: 3px; background-color: #fff; margin: 0; border: 1px dashed #4d79f6;"
                      bgcolor="#fff">
                      <tr
                        style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
                        <td class="content-wrap"
                          style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 20px;"
                          valign="top">
                          <meta itemprop="name" content="Reset Password"
                            style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
                          <table width="100%" cellpadding="0" cellspacing="0"
                            style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
                            <tr>
                              <td><a href="https://react-chatr.web.app/"><img
                                    src="https://firebasestorage.googleapis.com/v0/b/react-chatr.appspot.com/o/logo.svg?alt=media&token=76d5efa6-4f67-4738-b243-15de8c6ed3b6"
                                    alt=""
                                    style="margin-left: auto; margin-right: auto; margin-bottom: 20px; display:block; height: 50px;"></a>
                              </td>
                            </tr>
                            <tr
                              style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
                              <td class="content-block"
                                style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; color: #0a80ff; font-size: 24px; font-weight: 700; text-align: center; vertical-align: top; margin: 0; padding: 0 0 10px;"
                                valign="top">%APP_NAME% Chatr Invitation</td>
                            </tr>
                            <tr
                              style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
                              <td class="content-block"
                                style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; color: #3f5db3; font-size: 14px; vertical-align: top; margin: 0; padding: 10px 10px;"
                                valign="top"><b>${requestor}</b> has invited you to try out Chatr.</td>
                            </tr>
                            <tr
                              style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
                              <td class="content-block"
                                style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 10px 10px;"
                                valign="top">${message}
                              </td>
                            </tr>
                            <tr
                              style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
                              <td class="content-block" itemprop="handler" itemscope
                                itemtype="http://schema.org/HttpActionHandler"
                                style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 10px 10px;"
                                valign="top"><a href='https://react-chatr.web.app/login' itemprop="url"
                                  style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; color: #FFF; text-decoration: none; line-height: 2em; font-weight: bold; text-align: center; cursor: pointer; display: block; border-radius: 5px; text-transform: capitalize; background-color: #0a80ff; margin: 0; border-color: #0a80ff; border-style: solid; border-width: 10px 20px;">Register
                                  with Chatr</a></td>
                            </tr>
                            <tr
                              style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
                              <td class="content-block"
                                style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; padding-top: 5px; vertical-align: top; margin: 0; text-align: right;"
                                valign="top">&mdash; <b>%APP_NAME%</b> - Discussion and Chat Application
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </div>
                </td>
              </tr>
            </table>
          </div>
        </div>
      
      </body>
      
      </html>`;
      const transporter = nodemailer.createTransport(
        transport({
          service: 'gmail',
          auth: {
            user: functions.config().nodemailer.email,
            pass: functions.config().nodemailer.password,
          },
        })
      );
      const mailOptions = {
        to: email,
        from: 'noreply@react-chatr.firebaseapp.com',
        subject: `${requestor} has invited you to join Chatr`,
        text: htmlEmailBody,
        html: htmlEmailBody,
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          functions.logger.error(error.message, { structuredData: true });
        }
        response.status(200).send({
          message: `Invitation to ${email} sent from ${requestor} has been completed successfully`,
          meta: info,
        });
      });
    });
  }
);
