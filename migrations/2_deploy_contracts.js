const AceToken = artifacts.require('AceToken');
const DaiToken = artifacts.require('DaiToken');
const AceFarm = artifacts.require('AceFarm');

module.exports = async function(deployer, network, accounts) {
  // Deploy DAI Token
  await deployer.deploy(DaiToken);
  const daiToken = await DaiToken.deployed();

    // Deploy DAI Token
    await deployer.deploy(AceToken);
    const aceToken = await AceToken.deployed();

      // Deploy Ace Farm
  await deployer.deploy(AceFarm, aceToken.address, daiToken.address);
  const aceFarm = await AceFarm.deployed();

  //Transfer all tokens to the TokenFarm (I Million)
  await aceToken.transfer(aceFarm.address, '1000000000000000000000000');

  //Transfer 100 Mock DAI tokens to the investor
  await daiToken.transfer(accounts[2], '100000000000000000000');

};
