const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { assert } = require('chai');
// const { ethers } = require("ethers");

describe('Game5', function () {
  async function deployContractAndSetVariables() {
    const Game = await ethers.getContractFactory('Game5');
    const game = await Game.deploy();

    //generate add which is < than threshold
    let add = ethers.utils.arrayify("0x00FfFFfFFFfFFFFFfFfFfffFFFfffFfFffFfFFFf")
    let wallet
    while(add>=ethers.utils.arrayify("0x00FfFFfFFFfFFFFFfFfFfffFFFfffFfFffFfFFFf")){
      wallet = ethers.Wallet.createRandom();
      add = ethers.utils.arrayify(wallet.address)
    }

    
    console.log(add<ethers.utils.arrayify("0x00FfFFfFFFfFFFFFfFfFfffFFFfffFfFffFfFFFf"))
    const address = await wallet.getAddress();
    
    return { game,wallet,address};
  }
  it('should be a winner', async function () {
    let { game,wallet,address} = await loadFixture(deployContractAndSetVariables);
//必须连接provider，否则random钱包没有provider
    const provider = ethers.provider;
    wallet=wallet.connect(provider)
    
//必须给这个address一些eth，否则没法发起call

    const signer0 = ethers.provider.getSigner(0);
    const address0 = await signer0.getAddress();

    const senderBalanceBefore = await provider.getBalance(address0);
    console.log(`Sender balance before: ${ethers.utils.formatEther(senderBalanceBefore)} ETH`);
    const tx = {
        to: address,
        value: ethers.utils.parseEther("100") // 发送 0.01 ETH
    };
    const transactionResponse = await signer0.sendTransaction(tx);
    await transactionResponse.wait();
    
    const receiverBalance = await provider.getBalance(address);
    console.log(`Sender balance before: ${ethers.utils.formatEther(receiverBalance)} ETH`);
    
    
    await game.connect(wallet).win();

    // leave this assertion as-is
    assert(await game.isWon(), 'You did not win the game');
  });
});
