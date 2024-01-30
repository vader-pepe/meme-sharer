import { InstagramInstance } from './Module/instagram';
import { Meme } from './Module/meme-sharer';
import 'dotenv/config'

const IG_USERNAME = process.env.IG_USERNAME;
const IG_PASSWORD = process.env.IG_PASSWORD;

(async () => {
  const igIc = new InstagramInstance(IG_USERNAME, IG_PASSWORD);
  const ig = await igIc.start()
  const m = new Meme(ig)
  m.start('0 */4 * * *') // every 4 hrs
})();
