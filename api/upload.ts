import { NowRequest, NowResponse } from "@vercel/node";
import { WebClient } from "@slack/web-api";

export default (req: NowRequest, res: NowResponse) => {
  try {
    let data = [];
    req.on("data", (d) => {
      data.push(d);
    });
    req.on("end", async () => {
      const client = new WebClient(process.env.SLACK_USER_TOKEN);
      await client.users.setPhoto({
        image: Buffer.concat(data),
      });
      res.json({ ok: true });
    });
  } catch (e) {
    res.json({ ok: false });
  }
};
