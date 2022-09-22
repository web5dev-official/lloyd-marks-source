const { createAlchemyWeb3 } = require('@alch/alchemy-web3');
const web3 = createAlchemyWeb3("XRznHNhMx9axnrPTil7nMXgJf5uDJ5A9");
const Abi = require("../contract/abi.json");
const address = "0xc8860359d57F0965D88F5aeEB82Dfc6106822Fc0";
const NFtContract = new web3.eth.Contract(address,Abi);
const Name = NFtContract.methods.name();
console.log(Name)