const fs = require('fs');
const truffleContract = require('@truffle/contract');
const truffleAssert = require('truffle-assertions');

const CONFIG = require("../credentials");
const { web3 } = require('hardhat');

// const tokenABI = (JSON.parse(fs.readFileSync('./artifacts/contracts/erc20.sol/Token.json', 'utf8'))).abi;
let routerABI = fs.readFileSync('./abi/router.abi').toString();
routerABI = JSON.parse(routerABI);
let factoryABI = fs.readFileSync('./abi/factory.abi').toString();
factoryABI = JSON.parse(factoryABI);

contract("Wrap Unwrap Test Cases", () => {
    let liquidity;   
	let capl;
	let usdc; 
    let accounts;
    let router = null;
    let factory = null;
    let routerAdd = '0x05fF2B0DB69458A0750badebc4f9e13aDd608C7F';
    let factoryAdd = "0xbcfccbde45ce874adcb698cc183debcf17952812";

    // const provider = new Web3.providers.HttpProvider("http://127.0.0.1:8545");
    const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");
    // const provider = new Web3.providers.HttpProvider(CONFIG.polygonTestnet.url);


    before(async () => {
        accounts = await web3.eth.getAccounts()

        const LIQUIDITY = artifacts.require("contracts/version2/AddLiquidity2.sol:addLiquidity");
        const CAPL = artifacts.require("CAPL");
        const USDC = artifacts.require("USDC");

		capl = await CAPL.new()
        CAPL.setAsDeployed(capl)
        capl = await CAPL.deployed()

		usdc = await USDC.new()
        USDC.setAsDeployed(usdc)
        usdc = await USDC.deployed()

		console.log({
			capl: capl.address,
			usdc: usdc.address,
		})

		router = await ethers.getContractAt(routerABI, routerAdd);
        factory = await ethers.getContractAt(factoryABI, factoryAdd);

        await factory.createPair(capl.address, usdc.address);

		let pairAddress = await factory.getPair(capl.address, usdc.address);


		liquidity = await LIQUIDITY.new(capl.address, usdc.address, pairAddress)
        LIQUIDITY.setAsDeployed(liquidity)
        liquidity = await LIQUIDITY.deployed()

        // router = truffleContract({ abi: routerABI });
        // router.setProvider(provider);
        // router = await router.at(routerAdd);
  
        // factory = truffleContract({ abi: factoryABI });
        // factory.setProvider(provider);
        // factory = await factory.at(factoryADD);


        console.log({
			liquidity: liquidity.address,
			usdc: usdc.address,
			capl: capl.address,
            router: router.address,
            factory: factory.address,
        })

    })

    after(async () => {
        console.log('\u0007');
        console.log('\u0007');
        console.log('\u0007');
        console.log('\u0007');
    })

    const advanceBlock = () => new Promise((resolve, reject) => {
        web3.currentProvider.send({
            jsonrpc: '2.0',
            method: 'evm_mine',
            id: new Date().getTime()
        }, async (err, result) => {
            if (err) { return reject(err) }
            // const newBlockHash =await web3.eth.getBlock('latest').hash
            return resolve()
        })
    })
    
    const advanceBlocks = async (num) => {
        let resp = []
        for (let i = 0; i < num; i += 1) {
            resp.push(advanceBlock())
        }
        await Promise.all(resp)
    }
    
    const advancetime = (time) => new Promise((resolve, reject) => {
        web3.currentProvider.send({ 
            jsonrpc: '2.0',
            method: 'evm_increaseTime',
            id: new Date().getTime(),
            params: [time]
        }, async (err, result) => {
            if (err) { return reject(err) }
            const newBlockHash = await web3.eth.getBlock('latest').hash
    
            return resolve(newBlockHash)
        })
    })

    it ("should mint tokens, when called by admin", async () => {

    })

})