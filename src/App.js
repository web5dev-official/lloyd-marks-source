import './App.css';
import { useState } from 'react';
import { ethers } from 'ethers'

const Abi = require("./contract/abi.json");
const Abi2 = require("./contract/abi2.json");
const address = "0xeD14022E1B5df4f9A238e257074aA1D67087F765";
const Raindrop_contract = "0xdd37e255f664BCabd3e6CB450E84b609B992d6e5";
const provider = new ethers.providers.JsonRpcProvider(
  'https://eth-mainnet.g.alchemy.com/v2/7xjlT4hGMvqIwVmMKrmVYhVpwF-H9VKh',
)
// const address = "0x270968cb427B04C823E248e17eCaB233474b63d5";

function App() {

  const [NftStatus, setNftStatus] = useState('visible');
  const [ClaimNft, setClaimNft] = useState('none');
  const [BtnStatus, setBtnStatus] = useState("Connect to Mint");
  const [MintAmount, setMintAmount] = useState(1);
  const [Status, setStatus] = useState();
  const [Status_2, setStatus_2] = useState("Wallet not connected")

  const SmartContract = async (obj) => {
    // const provider = new ethers.providers.JsonRpcProvider(
    //   'https://eth-rinkeby.alchemyapi.io/v2/XRznHNhMx9axnrPTil7nMXgJf5uDJ5A9',
    // )
   const Raindrop_nft = new ethers.Contract(Raindrop_contract,Abi2,provider)
    const EthBal = await provider.getBalance(obj.address).then((balance) => {
      // convert a currency unit from wei to ether
      const balanceInEth = ethers.utils.formatEther(balance)
      if (0.1 > balanceInEth) {
        setBtnStatus('insuficient funds')
        setStatus_2(`balance: ${balanceInEth} ETH`);
      }else{
        setBtnStatus('Mint Now')
        setStatus_2('please wait contract is loading')
      }
     })
    const token = new ethers.Contract(address, Abi, provider)
    // const Holder = await token.check_holder(obj.address)
    // console.log(Holder)
    
    const Raindrop_bal = await Raindrop_nft.balanceOf(obj.address);
      if (Raindrop_bal >= 1) {
        setStatus_2("you are raindrop so you get 25% discount on minting on price")
        setClaimNft('visible')
        setNftStatus('none')
      } 
      if (Raindrop_bal ===0) {
        setStatus_2("you are not a raindop holder")
        setClaimNft('none')
        setNftStatus('visible')
      }
    
    
    console.log('this is raindrop balance',BigInt(Raindrop_bal))/* global BigInt */ 
  }
 
  const ETHER_TESTNET_PARAMS = {
    chainId: '0x1'
    
  }
  function switchToAvalancheChain() {
    // Request to switch to the selected Avalanche network
    window.ethereum.request({
      method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x1'}],
    })
  }

  const ClickHandler = async () => {
    if (BtnStatus === "Connect to Mint") {
       await connectWallet();
      
    }
    if (BtnStatus === "Mint Now") {
      console.log("ready fo mint")
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const token = new ethers.Contract(address, Abi,provider.getSigner());
      if (Status_2 === "you are not a raindop holder") {
        await token.mint(MintAmount,{value: ethers.utils.parseEther(`${MintAmount*0.1}`)});
      }else{
        await token.mint(MintAmount,{value: ethers.utils.parseEther(`${MintAmount*0.075}`)});
      }
     
    }
    if (BtnStatus === "insuficient funds"){
      alert('add more ether in your wallet to mint an nft')
    }
  }

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const addressArray = await window.ethereum.request({
          method: 'eth_requestAccounts',
        })
        const obj = {
          address: addressArray[0],
        }
       setBtnStatus('Mint Now');
       setStatus(
        'Connected ' +
          obj.address.slice(0, 4) +
          '...' +
          obj.address.slice(-3),
      )
      switchToAvalancheChain()
      //  setStatus(obj.address);
       SmartContract(obj);
        return obj
      } catch (err) {
        return {
          address: '',
        }
      }
    } else {
      return {
        address: '',
      }
    }
  }

  return (
    <div className="min-h-screen h-full w-full overflow-hidden flex flex-col items-center justify-center bg-brand-background ">
      <div className="relative w-screen h-screen flex flex-col items-center justify-center">
        <img
          src="/images/background.png"
        alt='cover'
          className=" w-full min-h-screen "
        />
       <div className='absolute h-full w-full'>
       <div className='absolute border-l-2 border-blue-400/60 top-2 right-0 bg-white text-base text-black bold pl-6 pr-1'>{Status_2}</div>
       <div className='absolute border-l-2 border-blue-400/60 top-10 right-0 bg-white text-base text-black bold pl-6 pr-1'>{Status}</div>
        <div className='flex flex-col h-screen w-screen justify-center items-center'>
          <div className='w-auto h-auto'>
       <h1 className=' fontm  text-[5.2rem] '>Lloyd Marks</h1>
       <h1 className='text-white text-[1.3rem] font2 new-line'>{`If you hold a Raindrop NFT,
         you will get 25% discount for this mint`}</h1>
          <div className='flex items-center mt-6 mb-6'>
       <h1 className='text-white text-[1.4rem] font2  inline'>{`I want to mint `}</h1>
       <input  className='bg-transparent border-b-2 s w-14 mx-2 text-white bold' min={1} max={200} type={"number"} onChange={event => setMintAmount(event.target.value)}></input>
       <h1 className='text-white text-[1.4rem] font2 inline'>{`nft(s)`}</h1>
       </div>
       <h1 className='text-white text-[1.2rem] font2 mt-4 'style={{ display : ClaimNft}}>{`your price will be ${MintAmount*0.075}  ETH and you will get ${MintAmount} nft`}</h1>
       <h1 className='text-white text-[1.2rem]  mt-4 font2'style={{ display : NftStatus}}>{`your price will be ${MintAmount*0.1} ETH and you will get ${MintAmount} nft`}</h1>
       <h1 className='text-white text-[1.2rem] my-2 font2'>{`The nft you get, will be randomly picked`}</h1>
       <h1 className='text-white text-[2.2rem] my-2 font2'>{`BEST OF LUCK`}</h1>
       <button className='bg-white my-2 text-black text-lg text-[1.6rem] px-4 py-2 rounded-[8px]'
       onClick={ClickHandler}>{BtnStatus}</button>
       </div>
       </div>
       </div>
      </div>
    </div>
  );
}

export default App;
