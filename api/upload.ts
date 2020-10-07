import { NowRequest, NowResponse } from "@vercel/node";
import { WebClient } from "@slack/web-api";
import cookie from "cookie";

export default (req: NowRequest, res: NowResponse) => {
  try {
    let data = [];
    req.on("data", (d) => {
      data.push(d);
    });
    req.on("end", async () => {
      const client = new WebClient();

      const profile = await client.users.identity({
        token: cookie.parse(req.headers.cookie).token,
      });

      const buf = Buffer.concat(data);

      await client.users.setPhoto({
        image: buf,
        token: process.env.SLACK_USER_TOKEN,
      });
      await client.files.upload({
        channels: process.env.LOG_CHANNEL,
        file: buf,
        initial_comment: `<@${(profile.user as any).id}> drew on the avatar!`,
        token: process.env.SLACK_BOT_TOKEN,
      });
      res.json({ ok: true });
    });
  } catch (e) {
    res.json({ ok: false });
  }
};
