from twitter.account import Account
import sys

ct0 = sys.argv[0]
auth_token = sys.argv[1]
account = Account(cookies={
    "ct0": ct0,
    "auth_token": auth_token
})
timeline = account.home_timeline()
