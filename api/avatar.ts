import { NowRequest, NowResponse } from "@vercel/node";
import { WebClient } from "@slack/web-api";
import axios from "axios";

export default async (req: NowRequest, res: NowResponse) => {
  const client = new WebClient(process.env.SLACK_USER_TOKEN);

  const profile = await client.users.profile.get();

  const stream = await axios((profile.profile as any).image_original, {
    responseType: "stream",
  });

  res.setHeader("Content-Type", "image/png");
  stream.data.pipe(res);
};
