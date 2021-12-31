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
    let router;
    let factory;
    // let routerAdd = '0x05fF2B0DB69458A0750badebc4f9e13aDd608C7F';
    // let factoryAdd = "0xBCfCcbde45cE874adCB698cC183deBcF17952812";
    let routerAdd = '0x7a250d5630b4cf539739df2c5dacb4c659f2488d';
    let factoryAdd = "0x5c69bee701ef814a2b6a3edd4b1652cb9cc5aa6f";

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

        // router = truffleContract({ abi: routerABI });
        // router.setProvider(provider);
        // routerInstance = await router.at(routerAdd);
  
        // factory = truffleContract({ abi: factoryABI });
        // factory.setProvider(provider);
        // factory = await factory.at(factoryAdd);

        await factory.createPair(capl.address, usdc.address, { from: accounts[0] });

		let pairAddress = await factory.getPair(capl.address, usdc.address)

		liquidity = await LIQUIDITY.new(capl.address, usdc.address, pairAddress, router.address)
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

    it ("should set slippage tolerance", async () => {
        await liquidity.setSlippageTolerance(10)
    })

    it ("should be able to add liquidity", async () => {
        await capl.approve(router.address, "100000000000000000000000000000")
        await usdc.approve(router.address, "100000000000000000000000000000")

        // 100capl = 20usdc
        await router.addLiquidity(capl.address, usdc.address, "10000000000", "2000000000000000000000", "1", "1", accounts[0], Date.now() + 10000000, { from: accounts[0] }); 
        const data = await router.getAmountsOut("1000000", [capl.address, usdc.address])
        console.log({
            usdcAmount: data[1].toString()
        })
        
        await capl.approve(liquidity.address, "100000000000000000000000000000")
        await usdc.approve(liquidity.address, "100000000000000000000000000000")

        const usdcBalBef = await usdc.balanceOf(liquidity.address)
        const caplBalBef = await capl.balanceOf(liquidity.address)
        const usdcBalBefAcc0 = await usdc.balanceOf(accounts[0])
        const caplBalBefAcc0 = await capl.balanceOf(accounts[0])
        
        await liquidity.addLiquidityCapl("10000000000000", "999999999", accounts[0])
        await liquidity.addLiquidityCapl("10000000000000", "999999999", accounts[0])
        await liquidity.addLiquidityCapl("10000000000000", "999999999", accounts[0])
        await liquidity.addLiquidityCapl("10000000000000", "999999999", accounts[0])

        await liquidity.addLiquidityUsdc("10000000000000000000000", "999999999", accounts[0])
        await liquidity.addLiquidityUsdc("10000000000000000000000", "999999999", accounts[0])
        await liquidity.addLiquidityUsdc("10000000000000000000000", "999999999", accounts[0])
        await liquidity.addLiquidityUsdc("10000000000000000000000", "999999999", accounts[0])

        await liquidity.addLiquidityBoth("10000000000000", "999999999")
        await liquidity.addLiquidityBoth("10000000000000", "999999999")
        await liquidity.addLiquidityBoth("10000000000000", "999999999")
        await liquidity.addLiquidityBoth("10000000000000", "999999999")

        const usdcBalAft = await usdc.balanceOf(liquidity.address)
        const caplBalAft = await capl.balanceOf(liquidity.address)
        const usdcBalAftAcc0 = await usdc.balanceOf(accounts[0])
        const caplBalAftAcc0 = await capl.balanceOf(accounts[0])

        console.log({
            usdcBalBef: usdcBalBef.toString(),
            caplBalBef: caplBalBef.toString(),
            usdcBalAft: usdcBalAft.toString(),
            caplBalAft: caplBalAft.toString(),
            usdcBalBefAcc0: usdcBalBefAcc0.toString(),
            caplBalBefAcc0: caplBalBefAcc0.toString(),
            usdcBalAftAcc0: usdcBalAftAcc0.toString(),
            caplBalAftAcc0: caplBalAftAcc0.toString(),
        })
    })

    it 

})