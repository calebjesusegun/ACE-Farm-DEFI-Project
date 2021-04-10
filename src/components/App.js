import React, { Component } from 'react'
import Web3 from 'web3';
import DaiToken from '../abis/DaiToken.json';
import AceToken from '../abis/AceToken.json';
import AceFarm from '../abis/AceFarm.json';
import Navbar from './Navbar'
import Main from './Main'
import './App.css'

class App extends Component {

  async componentWillMount(){
    await this.loadWeb3()
    await this.loadBlockChainData()
  }

  async loadBlockChainData(){
    const web3 = window.web3;
     
    const accounts = await web3.eth.getAccounts()
    this.setState({account: accounts[0]});

    const networkId = await web3.eth.net.getId();
    //console.log(networkId);

    //DAI TOKEN
    const daiTokenData = DaiToken.networks[networkId]
    if(daiTokenData){
      const daiToken = new web3.eth.Contract(DaiToken.abi, daiTokenData.address);
      this.setState({ daiToken })
      let daiTokenBalance = await daiToken.methods.balanceOf(this.state.account).call()
      this.setState({daiTokenBalance: daiTokenBalance.toString()});
    } else{
      window.alert('There is an issue with displaying the Dai Token Contract on the NETWORK');
    }

    //ACE TOKEN
    const aceTokenData = AceToken.networks[networkId]
    if(aceTokenData){
      const aceToken = new web3.eth.Contract(AceToken.abi, aceTokenData.address);
      this.setState({ aceToken })
      let aceTokenBalance = await aceToken.methods.balanceOf(this.state.account).call()
      this.setState({aceTokenBalance: aceTokenBalance.toString()});
    } else{
      window.alert('There is an issue with displaying the Ace Token Contract on the NETWORK');
    }

    //ACE FARM
    const aceFarmData = AceFarm.networks[networkId]
    if(aceFarmData){
      const aceFarm = new web3.eth.Contract(AceFarm.abi, aceFarmData.address);
      this.setState({ aceFarm })
      let stakingBalance = await aceFarm.methods.stakingBalance(this.state.account).call()
      this.setState({ stakingBalance: stakingBalance.toString()})
    } else{
      window.alert('There is an issue with displaying the Ace Farm Contract on the NETWORK');
    }

    this.setState({loading: false})

  }

  async loadWeb3(){
    if(window.ethereum){
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    }
    else if(window.web3){
      window.web3 = new Web3(window.web3.currentProvider);
    } 
    else {
      window.alert('A Non-Ethereum browser detected. Please consider using MetaMask');
    }
  }

  stakeTokens = (amount) => {
    this.setState({ loading: true })
    this.state.daiToken.methods.approve(this.state.aceFarm._address, amount).send({ from: this.state.account }).on('transactionHash', (hash) => {
      this.state.aceFarm.methods.stakeTokens(amount).send({ from: this.state.account }).on('transactionHash', (hash) => {
        this.setState({ loading: false })
      })
    })
  }

  unstakeTokens = (amount) => {
    this.setState({ loading: true })
    this.state.aceFarm.methods.unstakeTokens().send({ from: this.state.account }).on('transactionHash', (hash) => {
      this.setState({ loading: false })
    })
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '0x0',
      daiToken: {},
      aceToken: {},
      aceFarm: {},
      daiTokenBalance: '0',
      aceTokenBalance: '0',
      stakingBalance: '0',
      loading: true
    }
  }

  render() {

      let content;
      if(this.state.loading){
        content = <p id="loader" className="text-center">Loading...</p>
      } else{
        content = <Main 
        daiTokenBalance= {this.state.daiTokenBalance}
        aceTokenBalance= {this.state.aceTokenBalance}
        stakingBalance= {this.state.stakingBalance}
        stakeTokens = {this.stakeTokens}
        unstakeTokens = {this.unstakeTokens}
        />;
      }

    return (
      <div>
        <Navbar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '600px' }}>
              <div className="content mr-auto ml-auto">
                <a
                  href="https://github.com/calebjesusegun/ACE-Farm-DEFI-Project"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                </a>

                {content}

              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
