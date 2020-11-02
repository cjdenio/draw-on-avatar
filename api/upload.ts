import { NowRequest, NowResponse } from "@vercel/node";
import { WebClient } from "@slack/web-api";
import cookie from "cookie";

const banlist = [
  //"U01ARQ7M5UL"
];

export default (req: NowRequest, res: NowResponse) => {
  if (
    process.env.NODE_ENV === "production" &&
    new URL(req.headers.origin).host != req.headers.host
  ) {
    // Silently disallow requests from other origins
    res.json({ ok: true });
    console.log("failing silently");
    return;
  }

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

      if (banlist.includes((profile.user as any).id)) {
        res.status(400);
        res.json({ ok: false, message: "You have been banned" });
        console.log("ban");
        return;
      }

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
    res.status(400);
    res.json({ ok: false });
  }
};
