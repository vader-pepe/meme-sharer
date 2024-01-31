// @ts-ignore
import { execSync } from 'child_process'
import { resolve } from 'path'
import { existsSync } from 'fs'

export class TwitterInstance {
  isCompatible: boolean = false
  private thisDir: string = resolve("./")
  private venvExist: boolean = false
  constructor() {
    this.checkPythonVersion()
    this.createVirtualEnv()
  }

  private async checkPythonVersion() {
    const version = this.runBash('python --version')
    if (!version.includes('Python 3')) {
      throw new Error('Your Python is not found or not compatible!')
    }
    this.isCompatible = true
  }

  private runBash(command: string) {
    const result = execSync(command)
    return result.toString('utf8')
  }

  private createVirtualEnv() {
    this.venvExist = existsSync(`${this.thisDir}/py-venv`)
    if (!this.venvExist) {
      if (this.isCompatible) {
        this.runBash(`python -m venv ${this.thisDir}/py-venv`)
        this.runBash(`${this.thisDir}/py-venv/bin/pip install twitter-api-client -U`)
      }
    }
  }

  // only cookies accepted
  accountSignIn(auth_token: string, ct0: string) {
    if (this.isCompatible) {
      // TODO: fix the command. too long
      return this.runBash(`${this.thisDir}/py-venv/bin/python ${this.thisDir}/src/Module/Twitter/login.py ${ct0} ${auth_token}`)
    }
  }
}
