import { InstagramInstance } from './Module/instagram';
import { TwitterInstance } from './Module/twitter';
import { Meme } from './Module/meme-sharer';
import 'dotenv/config'

const IG_USERNAME = process.env.IG_USERNAME;
const IG_PASSWORD = process.env.IG_PASSWORD;
const twt_auth_token = process.env.TWT_AUTH_TOKEN;
const twt_ctzero = process.env.TWT_CTZERO;

(async () => {
  // const igIc = new InstagramInstance(IG_USERNAME, IG_PASSWORD);
  // const ig = await igIc.start()
  // const m = new Meme()
  // m.start('0 3 * * *', ig) // everyday at 3 o'clock
  const t = new TwitterInstance()
  const x = t.accountSignIn(twt_auth_token, twt_ctzero)
  console.log({ x })
})();
