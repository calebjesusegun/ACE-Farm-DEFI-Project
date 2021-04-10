pragma solidity ^0.5.0;

import "./AceToken.sol";
import "./DaiToken.sol";

contract AceFarm {

    string public name = "ACE Farm";
    address public owner;
    AceToken public aceToken;
    DaiToken public daiToken;

    address[] public stakers;
    mapping(address => uint) public stakingBalance;
    mapping(address => bool) public hasStaked;
    mapping(address => bool) public isStaking;

    constructor(AceToken _aceToken, DaiToken _daiToken) public{
        daiToken = _daiToken;
        aceToken = _aceToken;
        owner = msg.sender;
    }

    //STAKE TOKENS

    function stakeTokens(uint _amount) public {

        //Require amount greater than 0
        require(_amount > 0, "Amount cannot be 0");

        //Transfer Dai Tokens to this contract for staking or rewards
        daiToken.transferFrom(msg.sender, address(this), _amount);

        //Update staking stakingBalance
        stakingBalance[msg.sender] = stakingBalance[msg.sender]  + _amount;

        if(!hasStaked[msg.sender]){
            stakers.push(msg.sender);
        }

        //Update staking status
        isStaking[msg.sender] = true;
        hasStaked[msg.sender] = true;

    }

    //UNSTAKE TOKENS
    function unstakeTokens() public {
        //Fetch staking balance
        uint balance = stakingBalance[msg.sender];

        //Require amount greater than 0
        require(balance > 0, "Staking balance can't be 0");

        //Transfer Dai to the Contract for staking
        daiToken.transfer(msg.sender, balance);

        //Reset staking balance
        stakingBalance[msg.sender] = 0;

        //Update staking status
        isStaking[msg.sender] = false;
    }

    
    //ISSUE TOKENS
    function issueToken() public {
        require(msg.sender == owner, "Must be the Owner of the Contract");
        
        for(uint i = 0; i < stakers.length; i++){
            address recipient = stakers[i]; 
            uint balance = stakingBalance[recipient];
            if(balance > 0){
                aceToken.transfer(recipient, balance);
            }       
        }
    }
    }