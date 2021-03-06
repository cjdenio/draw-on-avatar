import { NowRequest, NowResponse } from "@vercel/node";

export default (req: NowRequest, res: NowResponse) => {
  res.redirect(
    `https://slack.com/oauth/v2/authorize?client_id=${process.env.SLACK_CLIENT_ID}&user_scope=users.profile:read,users.profile:write&scope=chat:write,files:write&state=authorize`
  );
};
