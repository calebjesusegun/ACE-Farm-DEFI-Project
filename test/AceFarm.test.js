const AceToken = artifacts.require('AceToken');
const DaiToken = artifacts.require('DaiToken');
const AceFarm = artifacts.require('AceFarm');

require('chai')
    .use(require('chai-as-promised'))
    .should();

function tokens(n){
    return web3.utils.toWei(n, 'ether');
}

contract('AceFarm', ([owner, investor]) => {

    let daiToken, aceToken, aceFarm;

    before(async () => {
        //Loading Contracts
        daiToken = await DaiToken.new();
        aceToken = await AceToken.new();
        aceFarm = await AceFarm.new(aceToken.address, daiToken.address);

        //Transfer all Ace Tokens to farm (1 Million)
        await aceToken.transfer(aceFarm.address, tokens('1000000'));

        //Send tokens to investor
        await daiToken.transfer(investor, tokens('100'), { from: owner });

    })
    //Write tests
    describe('Mock DAI Token Deployment', async () => {
        it('has a name', async ()=> {
            const name = await daiToken.name();
            assert.equal(name, 'Mock DAI Token');
        })
    })

    describe('Ace Token Deployment', async () => {
        it('has a name', async ()=> {
            const name = await aceToken.name();
            assert.equal(name, 'ACE Token');
        })
    })

    describe('Ace Farm Deployment', async () => {
        it('has a name', async ()=> {
            const name = await aceFarm.name();
            assert.equal(name, 'ACE Farm');
        })

        it('Contract has tokens', async ()=> {
            let balance = await aceToken.balanceOf(aceFarm.address);
            assert.equal(balance.toString(), tokens('1000000'));
        })
    })

    describe('Farming Tokens', async () => {
        it('Rewards investors for staking mDai tokens', async () => {
            let result;

            //Check investor balance before staking
            result = await daiToken.balanceOf(investor);
            assert.equal(result.toString(), tokens('100'), 'Investor Mock DAI wallet balance is correct before staking');
            
            //Stake Dai Tokens
            await daiToken.approve(aceFarm.address, tokens('100'), {from: investor});
            await aceFarm.stakeTokens(tokens('100'), {from: investor});

            //Check staking result
            result = await daiToken.balanceOf(investor);
            assert.equal(result.toString(), tokens('0'), 'Investor Mock DAI wallet balance is correct before staking');

            result = await daiToken.balanceOf(aceFarm.address);
            assert.equal(result.toString(), tokens('100'), 'Token Farm Dai balance correct after staking');
            
            result = await aceFarm.stakingBalance(investor);
            assert.equal(result.toString(), tokens('100'), 'Investor staking balance correct after staking');

            result = await aceFarm.isStaking(investor);
            assert.equal(result.toString(), 'true', 'Investor staking status correct after staking');
        
            //Issue Tokens
            await aceFarm.issueToken({from: owner});

            //Check balance after issue
            result = await aceToken.balanceOf(investor);
            assert.equal(result.toString(), tokens('100'), "Investor Ace Token wallet");

            //Ensure only owner can issue tokens
            await aceFarm.issueToken({from: investor}).should.be.rejected;
        
            //Check results after unstaking
            result = await daiToken.balanceOf(investor);
            assert.equal(result.toString(), tokens('100'), "Investor Dai wallet balance is correct after staking");

            result = await daiToken.balanceOf(aceFarm.address);
            assert.equal(result.toString(), tokens('0'), "Token Farm Dai balance is correct after staking");

            result = await aceFarm.stakingBalance(investor);
            assert.equal(result.toString(), tokens('0'), "Investor staking balance is correct after staking");

            result = await aceFarm.isStaking(investor);
            assert.equal(result.toString(), 'false', "Investor staking status is correct after staking");
        })
    });
})
