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
    - uses: netlibs/iam-mint-action@v2
      with:          
        endpoint: https://my.endpoint/token_issuer
        role: arn:aws:iam::<account>:role/<something>
        token: ${{ secrets.GITHUB_TOKEN }}
    # you can now use AWS-SDK based apps with ambient credentials, for exmaple:
    - name: AWS Login
      run: |
        endpoint=$(aws ecr get-authorization-token --region us-west-2 --output text --query 'authorizationData[].proxyEndpoint')
        aws ecr get-authorization-token --region us-west-2 --output text --query 'authorizationData[].authorizationToken' | base64 --decode | cut -d: -f2 | docker login -u AWS --password-stdin $endpoint
    
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
