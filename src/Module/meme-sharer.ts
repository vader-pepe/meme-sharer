import { IgApiClient, } from 'instagram-private-api';
import cron from 'node-cron'
import { writeFile, readFile } from 'fs/promises'
import pngToPng from 'png-to-jpeg'

interface MemeDataIF {
  postLink: string;
  subreddit: string;
  title: string;
  url: string;
  nsfw: boolean;
  spoiler: boolean;
  author: string;
  ups?: number;
  preview: Array<string>
}

export class Meme {

  constructor() {
  }

  start(schedule: string, ig: IgApiClient) {
    cron.schedule(schedule, async () => {
      console.log('cron running')
      const meme = await this.parseMeme()
      const splitted = meme.url.split(".")
      const extension = splitted[splitted.length - 1]
      const fimg = await fetch(meme.url)
      const fimgb = Buffer.from(await fimg.arrayBuffer())
      await this.post(fimgb, extension, ig)
    })
  }

  async post(data: Buffer, extension: string, ig: IgApiClient) {
    let converted: Buffer
    if (extension === 'png') {
      pngToPng({ quality: 90 })(data).then(async (output: string) => await writeFile('./img.jpg', output))
      converted = await readFile('./img.jpg')
    } else if (extension === 'jpg') {
      converted = data
    } else {
      console.log('enough meme for today')
    }

    const publishResult = await ig.publish.photo({
      file: converted
    }).catch(err => {
      console.log({ err })
      throw new Error('cannot post')
    })
    console.log('published: ', publishResult)
    console.log('image posted!')
  }

  private async parseMeme() {
    const options = { method: 'GET' };

    const meme = await fetch('https://meme-api.com/gimme', options)
    const jsonMeme = await meme.json()
    const parsed = new MemeDto(jsonMeme)
    if (parsed.nsfw) {
      throw new Error('Meme contains NSFW!')
    }
    return parsed
  }
}

class MemeDto {
  postLink: string;
  subreddit: string;
  title: string;
  url: string;
  nsfw: boolean;
  spoiler: boolean;
  author: string;
  ups?: number;
  preview: Array<string>
  constructor(data: MemeDataIF) {
    this.postLink = data.postLink;
    this.subreddit = data.title;
    this.url = data.url;
    this.nsfw = data.nsfw;
    this.spoiler = data.spoiler;
    this.author = data.author;
    this.ups = data.ups ?? 0;
    this.preview = data.preview;
  }
}
