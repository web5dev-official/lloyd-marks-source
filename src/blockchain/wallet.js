import walletConnectModule from "@web3-onboard/walletconnect";
import injectedModule from "@web3-onboard/injected-wallets";
import Onboard from "@web3-onboard/core";
import { ethers } from "ethers";
import { Config } from "./config";


const walletConnect = walletConnectModule(
    {
        bridge: 'https://bridge.walletconnect.org',
        qrcodeModalOptions: {
            mobileLinks: ['metamask', 'trust']
        }
    }
);
const injected = injectedModule();

const modules = [walletConnect, injected];

const onboard = Onboard({
    wallets: modules, // created in previous step
    chains: [
        {
            id: "0x1",
            token: "ETH",
            namespace: "evm",
            label: "Etherum",
            rpcUrl: Config.RpcUrl
        }
    ],
    appMetadata: {
        name: "My App",
        icon: "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg",
        logo: "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg",
        description: "ZepCash",
        recommendedInjectedWallets: [
            { name: "MetaMask", url: "https://metamask.io" }
        ]
    }
});

export const WalletConnect = async () => {
    try {
        const wallets = await onboard.connectWallet();
        const { accounts, chains } = wallets[0];
        const ethersProvider = new ethers.providers.Web3Provider(wallets[0].provider, 'any')
        const obj = {
            Address: accounts[0].address,
            Provider: wallets[0].provider,
            Chain: chains[0],
            signer: ethersProvider.getSigner()
        }
       return obj;
    } catch (error) {
        console.log('Error In Wallet Connect:' + error)
        alert("Erorr in Wallet Connect");
    }
}
//  export const get_url = async () => {
//     try{

//     }catch(error){}
//  }

