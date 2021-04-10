const AceFarm = artifacts.require('AceFarm');

module.exports = async function(callback){
    let aceFarm = await AceFarm.deployed();
    await aceFarm.issueToken();

    console.log("Tokens Issued!");

    callback();
}