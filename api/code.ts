import { NowRequest, NowResponse } from "@vercel/node";
import { WebClient } from "@slack/web-api";

export default async (req: NowRequest, res: NowResponse) => {
  const client = new WebClient();

  const resp = await client.oauth.v2.access({
    client_id: process.env.SLACK_CLIENT_ID,
    client_secret: process.env.SLACK_CLIENT_SECRET,
    code: req.query.code as string,
  });

  if (req.query.state == "authorize") {
    res.setHeader("Content-Type", "text/html");
    res.send(
      `Your token is <b>${
        (resp.authed_user as any).access_token
      }</b>. Please set this to the <pre>SLACK_USER_TOKEN</pre> environment variable.`
    );
  } else {
    res.setHeader(
      "Set-Cookie",
      `token=${(resp.authed_user as any).access_token}`
    );
    res.redirect("/");
  }
};
