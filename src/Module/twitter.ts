// @ts-ignore
import child from 'node:child_process'

export class TwitterInstance {
  constructor() {

  }

  private runBash(command: string) {
    child.exec(command, (err, stdout, stderr) => {
      if (err) {
        //some err occurred
        console.error(err)
      } else {
        // the *entire* stdout and stderr (buffered)
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
      }
    })
  }
}
