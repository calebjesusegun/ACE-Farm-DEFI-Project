# ACE Farm Project
===========================

The ACE Farm is a Binance Smart Chain smart contract that bridges the gap between ART, CRYPTOCURRENCY and EXCHANGE(ACE) allowing users to supply assets and upload art picture images and thereby receive aceTokens as reward. A yield farming/Liquidity project that provides a platform for accounts/users on the blockchain to stake and unstake aceTokens through the use of art pictures and a synthetic stablecoin such as Dai. The aceToken contract tracks the balances and algorithmically set interest rates for users.

Before getting started with this repo, please read:

## Target Industry

The Target industries are mainly Investors and the Art Sector  

## Target Users

The target users are Art designers 

## Installation

To run Ace Farm, pull the repository from GitHub and install its dependencies. You will need [npm](https://docs.npmjs.com/cli/install) installed.

    git clone https://github.com/calebjesusegun/ACE-Farm-DEFI-Project.git
    cd ACE-Farm-DEFI-Project
    npm install
    npm run start

To run the contract locally you will need metamask extension installed in your chrome browser, truffle installed and ganache installed globally.

    truffle compile
    truffle migrate --reset
 
To Issue Tokens to Investors as the Owner of the contract you installed.

    truffle exec scripts/issue-token.js
