# voting-dapp

## Dependencies

- geth 1.7.3-stable
- Solidity v0.4.19
- npm 5.6.0
- node v9.4.0
- Truffle v4.0.6

## Setup

### Ubuntu

First, install the latest geth (1.7.3) to your machine.

For Ubuntu, you can follow the instructions on the official wiki.

```sh
sudo apt-get install software-properties-common
sudo add-apt-repository -y ppa:ethereum/ethereum
sudo apt-get update
sudo apt-get install ethereum
```

If you just need to upgrade `geth` from a previous version, you can just run:
```sh
sudo apt install geth
```

### MacOS

If you're downloading this to your Mac, you'll need to download the packages manually to get the latest
(1.7.3) release.
https://geth.ethereum.org/downloads/

Extract it and copy the `geth` binary to somewhere in your path.

```
# ppham @ Pauls-Air-2 in ~/Downloads [21:46:25]
$ tar zxvf geth-darwin-amd64-1.7.3-4bb3c89d.tar.gz
x geth-darwin-amd64-1.7.3-4bb3c89d/
x geth-darwin-amd64-1.7.3-4bb3c89d/COPYING
x geth-darwin-amd64-1.7.3-4bb3c89d/geth

# ppham @ Pauls-Air-2 in ~/Downloads [21:46:39]
$ sudo mv geth-darwin-amd64-1.7.3-4bb3c89d/geth /usr/local/bin/geth
```

### Running your own node on Rinkeby testnet

The contract run in this application was deployed on `Rinkeby` testnet.

If you want ro run a full node, you can just run `geth` passing `--rinkeby` as an option:
```sh
geth --rinkeby
```

To run a light node you can use the `syncmode` option:
```sh
geth --rinkeby --syncmode "light"
```

When the sync is done, you need to specify that you want to use `rpc` and specify which APIs will have permission:
```sh
geth --rinkeby --rpc --rpcapi="db,eth,net,web3,personal"
```
or (for the light mode):
```sh
geth --rinkeby --syncmode "light" --rpc --rpcapi="db,eth,net,web3,personal"
```

Then you can attach `geth.ipc` to the running node in order to make queries to the blockchain:
```sh
geth attach ~/.ethereum/rinkeby/geth.ipc
```
or:
```sh
geth attach http://localhost:8545
```

### Truffle Framework

This application is built with Truffle framework

```sh
npm install -g truffle
```
