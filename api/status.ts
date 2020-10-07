import { NowRequest, NowResponse } from "@vercel/node";
import cookie from "cookie";
import { WebClient } from "@slack/web-api";

export default async (req: NowRequest, res: NowResponse) => {
  const cookies = cookie.parse(req.headers.cookie || "");

  if (!cookies.token) {
    res.status(400);
    res.json({ ok: false });
    return;
  }

  try {
    const client = new WebClient(cookies.token);
    const user = await client.users.identity();
    if (!user.ok) {
      throw new Error();
    }
    res.json(user);
  } catch (e) {
    res.status(400);
    res.json({ ok: false });
  }
};
