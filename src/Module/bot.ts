import { IgApiClient } from "instagram-private-api";
import { writeFile, access, constants, readFile } from 'fs/promises'

export class InstagramInstance {
  username: string;
  password: string;

  constructor(username: string, password: string) {
    this.username = username;
    this.password = password;
  }

  private async isSessionExist() {
    // here you would check if the data exists
    const isExist = await access('./user.json', constants.F_OK).then(() => true).catch(() => false) ?? false
    return isExist;
  }

  private async loadSession() {
    // here you would load the data
    let data: string = ""
    data = await readFile('./user.json', { encoding: 'utf-8' }).catch(() => "")
    return data;
  }

  private async saveSession(data: any) {
    // here you would save it to a file/database etc.
    // you could save it to a file: writeFile(path, JSON.stringify(data))
    await writeFile('./user.json', JSON.stringify(data))
    return data;
  }

  async start() {
    const ig = new IgApiClient();
    ig.state.generateDevice(this.username);
    // This function executes after every request
    ig.request.end$.subscribe(async () => {
      const serialized = await ig.state.serialize();
      delete serialized.constants; // this deletes the version info, so you'll always use the version provided by the library
      this.saveSession(serialized);
    });

    if (this.isSessionExist()) {
      // import state accepts both a string as well as an object
      // the string should be a JSON object
      await ig.state.deserialize(this.loadSession());
    }
    // This call will provoke request.end$ stream
    const loggedInUser = await ig.account.login(this.username, this.password);
    return ig
    // TODO: listen for every messages got
    //
    // const messages = await ig.feed.directInbox().items()
    // await writeFile('./messages.json', JSON.stringify(messages))
    // Most of the time you don't have to login after loading the state
  }
}
