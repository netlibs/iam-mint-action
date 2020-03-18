# Mint AWS temporary credentials from GitHub action

simply calls an API endpoint to swap GITHUB_TOKEN for minted STS token. You'll need to provide the backend to validate the token.

## Usage from Workflow

```
name: CI
on: [push]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: netlibs/iam-mint-action@v1
      with:          
        endpoint: https://my.endpoint/token
        token: ${{ secrets.GITHUB_TOKEN }}
    # you can now use AWS-SDK based apps with ambient credentials
    - run: aws sts get-caller-identity
```

## Options

- token
- endpoint
- actor
- project
- region
- profile


## New Version

```
npm run build
git commit -a -m 'new version'
git tag -a -m "intial release" v1
git push --follow-tags
```