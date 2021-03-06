import React, { Component } from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import { connect } from 'react-redux'
import { getContract, updateContract } from '../actions'
import Welcome from '../components/Welcome'
import Wizard1 from '../components/Wizard1'
import Wizard2 from '../components/Wizard2'
import Wizard3 from '../components/Wizard3'
import Wizard4 from '../components/Wizard4'
import Main from '../components/Main'
import Loading from '../components/Loading'
import CError from '../components/CError'
import * as contract from '../contract.js'
import Web3 from 'web3';


class Wizard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contractName: this.props.contractName || "myRaspberryPi",
      contractLocation: this.props.contractLocation || "Berlin, Germany",
      contractURL: this.props.contractURL || "https://example.com",
      fetching: this.props.fetching,
      contract: this.props.contract,
      contractStatus: "", // for tracking the state of the contract creation.
      error: this.props.error, // for errors connecting to ashya collector
      merror: "", // for metamask errors.
      pageForward: true,
      currentPage: 1,
      accounts: [],
      provider: "",
      gasPrice: "",  // price of gas 
      gasLimit: "",  // amount of gas willing to pay
      working: false,
      workingMessage: "..."
    }
    this.renderPage = this.renderPage.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.nextPage = this.nextPage.bind(this);
    this.createContract = this.createContract.bind(this);
    this.validate = this.validate.bind(this);
  }
 

  //addWeb3() 
  componentDidMount() {
    var t = this;
    window.addEventListener('load', async () =>  {
      // support november 2nd update: 
      // https://medium.com/metamask/https-medium-com-metamask-breaking-change-injecting-web3-7722797916a8
      if (window.ethereum) {
        console.log("New ethereum")
        window.web3 = new Web3(window.ethereum);
        try {
          await window.ethereum.enable();
          t.validate(t)
        } catch (error) {
          t.setState({merror: "Metamask not enabled."})
        }
      }
      else if (typeof window.web3 !== 'undefined') {
        t.validate(t)
      }else {
        console.log("no web3 provided.")
      }
    })
    this.props.getContract()
  }

  validate = (t) => {
    t.setState({isConnected: true})
    var p = new Web3(window.web3.currentProvider)
    t.setState({provider : p})
    console.log('MetaMask is installed')
    p.eth.getAccounts(function(err, acc) {
      if (err) {
        console.error(err)
        t.setState({merror: err})
        return
      }
      if (acc.length === 0) {
        console.log('MetaMask is locked')
        t.setState({merror: "Metamask is locked"})
        return
      }
      t.setState({merror : ""})
      // set accounts
      t.setState({accounts: acc});
    
    }) 
  }




  
  
  componentWillReceiveProps(nextProps) {
    var address = nextProps.contract || ""
    var err = nextProps.error || ""
    //console.log("next props received: " + nextProps.contract)
    this.setState({
      contract: address,
      error: err,
    })
  }


  /* changing form values */
  handleChange = (event) => {
    const s = this.state
    switch(event.target.id) {
      case "contractName":
        s.contractName = event.target.value;
        break;
      case "contractLocation":
        s.contractLocation = event.target.value;
        break;
      case "contractURL":
        s.contractURL = event.target.value;
        break;
      default:
    }
    this.forceUpdate();
  }

  // registers the contract with the Ashya Registry at Ashya.io
  registerContract = () => {
    let t = this
    let account = t.state.accounts[0]
    t.setState({working: true})
    t.setState({workingMessage: "Use Metamask to complete transaction"})
    let deviceContract = new this.state.provider.eth.Contract(contract.abiArray, this.state.contract);
    var eth = Web3.utils.toWei("0.040")
    deviceContract.methods.registerDevice(contract.registryAddress).estimateGas({
      from: account,
      value: eth
    })
    // once we have the gas estimate get the gas price
    .then(function(gasEstimate) {
      t.setState({workingMessage: "Gas estimate" + gasEstimate.toString()})
      t.setState({gasLimit: gasEstimate})
      t.state.provider.eth.getGasPrice()
      .then(function(gasPrice) {
        t.setState({gasPrice: gasPrice});
        t.setState({workingMessage: "Registering contract"})
        deviceContract.methods.registerDevice(contract.registryAddress).send({
          from: account,
          gas: t.state.gasLimit + 800000,
          gasPrice: t.state.gasPrice,
          value:  eth,
        }, function(error, transactionHash){
            t.setState({contractStatus: "Submitted contract with Transaction Hash: ", transactionHash})
        })
        .on('error', function(error) {
          console.error(error)
          t.setState({working : false})
          t.setState({contractStatus: "Error submitting contract: ", error})
        })
        .on('transactionHash', function(transactionHash) {
          t.setState({contractStatus: "Successfully submitted transaction hash: " +  transactionHash})
        })
        .on('receipt', function(receipt) {
          t.setState({contractStatus: "Contract Address: " + receipt.contractAddress})
          console.log("got receipt! address: ", receipt.contractAddress)
          t.setState({working : false})
        })
        .on('confirmation', function(confirmationNumber, receipt) {
          t.setState({contractStatus: "Contract Address: "+ receipt.contractAddress + " Confirmation: " + confirmationNumber})
          t.setState({working : false})
        })
      })
    })
    .catch(function(error) {
      t.setState({working : false})
      console.log(error);
      t.setState({merror: error.toString()})
    })
  }


  /* Create the contract */
  createContract = () => {
    let t = this
    /* show the user that we are working! */
    t.setState({workingMessage: "Estimating Contract cost..."})
    t.setState({working : true})

    /* figure out how much gas the code will take to store in Ethereum */
    t.state.provider.eth.estimateGas({ data: contract.bytecode }
    ).then(function(gasEstimate) {
      t.setState({gasLimit: gasEstimate })
      // get the price of the gas
      t.setState({workingMessage: "Get Gas Price..."})
      t.state.provider.eth.getGasPrice()
      .then(function(gasPrice) {
        t.setState({gasPrice: gasPrice});
        let account = t.state.accounts[0]
        // create the contract
        t.setState({workingMessage: "Waiting for you to confirm Metamask transaction."})
        let deviceContract = new t.state.provider.eth.Contract(contract.abiArray, null, { data: contract.bytecode });
        console.log("gas price: ", t.state.gasPrice, " gas limit: ", t.state.gasLimit)
        // deploy the contract
        deviceContract.deploy({
          data: contract.bytecode,
          arguments: [
            t.state.contractName,
            t.state.contractLocation,
            t.state.contractURL
          ]
        }).send({
             from: account,
             gas: parseInt(t.state.gasLimit,10) + 800000 ,
             gasPrice: t.state.gasPrice.toString(),
        }, function(error, transactionHash){
            t.setState({contractStatus: "Submitted contract with Transaction Hash: ", transactionHash})
            t.setState({workingMessage: "Contract Transaction Hash: " + transactionHash})
        })
        .on('error', function(error) {
            console.error(error)
            t.setState({contractStatus:  "Metamask transaction failed."})
            t.setState({working : false})
        })
        .on('transactionHash', function(transactionHash) {
            t.setState({contractStatus: "Successfully submitted transaction hash: " +  transactionHash})
            t.setState({workingMessage: "Contract Transaction Hash: " + transactionHash})
        })
        .on('receipt', function(receipt) {
            t.setState({contractStatus: "Contract Address: " + receipt.contractAddress})
            console.log("got receipt! address: ", receipt.contractAddress)
            t.setState({workingMessage: "Transaction Receipt: "+ receipt.contractAddress})
        })
        .on('confirmation', function(confirmationNumber, receipt) {
            t.setState({contractStatus: "Contract Address: "+ receipt.contractAddress + " Confirmation: " + confirmationNumber})
            t.setState({workingMessage: "Contract Address: "+ receipt.contractAddress + " Confirmation: " + confirmationNumber})
        })
        .then(function(newContractInstance){
            console.log("Created New Contract Instance: ", newContractInstance.options.address);
            // store contract in Ashya Device. 
            t.props.updateContract(newContractInstance.options.address);
            t.setState({working : false})
        })
      })
    }) 
    .catch(function(error) {
      console.error(error)
      t.setState({working : false})
    })
  }


  deleteContract = () => {
    this.props.updateContract("")
  }

  /* for changing pages in the form */
  nextPage = (pageId) => {
    const s = this.state
    /* see if we go backwards or forward */
    if( pageId < this.state.currentPage ){
      s.pageForward = false
    }else {
      s.pageForward = true
    }
    s.currentPage = pageId
    this.forceUpdate();
  }

  render() {
    if(this.state.error){
    
      return (
        <CError err={this.state.error}/>
      )
    }
    return(
      this.state.contract === "" ? 
      <div>
        <Loading working={this.state.working} workingMessage={this.state.workingMessage}/>
        <ReactCSSTransitionGroup
          transitionName={ this.state.pageForward ? "page" : "prev" }
          transitionEnterTimeout={500}
          transitionLeaveTimeout={500}
        >
        {this.renderPage()}
        </ReactCSSTransitionGroup>
        </div>
      :
        <div>
          <Loading working={this.state.working} workingMessage={this.state.workingMessage}/>
          <Main address={this.state.contract} registerFunc={this.registerContract} deleteFunc={this.deleteContract}/> 
        </div>
    )
  }


  /* render the pages of the form using transition groups */
  renderPage() {
    switch (this.state.currentPage) {
      case 1:
        return (<Welcome key={1} nextClick={() => this.nextPage(2)} accounts={this.state.accounts} merror={this.state.merror} />);
      case 2:
        return (<Wizard1 key={2} 
                contractName={this.state.contractName} 
                handleChange={this.handleChange} 
                prevClick={() => this.nextPage(1)}
                nextClick={() => this.nextPage(3)}/>);
      case 3:
        return (<Wizard2 key={3}
                contractLocation={this.state.contractLocation} 
                handleChange={this.handleChange} 
                prevClick={() => this.nextPage(2)}
                nextClick={() => this.nextPage(4)}/>);
      case 4:
        return (<Wizard3 key={4}
                contractURL={this.state.contractURL} 
                handleChange={this.handleChange} 
                prevClick={() => this.nextPage(3)}
                nextClick={() => this.nextPage(5)}/>);
      case 5:
        return (<Wizard4 key={5}
                contractName={this.state.contractName} 
                contractLocation={this.state.contractLocation} 
                contractURL={this.state.contractURL} 
                contractStatus={this.state.contractStatus}
                prevClick={() => this.nextPage(4)}
                createContract={this.createContract}/>);
    
      default:
        return (<Welcome nextClick={() => this.setState({currentPage: 2})}/>)
    }
  }  
}

const mapStateToProps = (state, ownProps) => ({
  contractName: state.blockchain.name,
  contractLocation: state.blockchain.location,
  contractURL: state.blockchain.url,
  fetching: state.blockchain.fetching,
  contract: state.blockchain.contract,
  error: state.blockchain.error
})

const mapDispatchToProps = (dispatch) => ({
  getContract: () => dispatch(getContract()), // get the current contract. 
  updateContract: (address) => dispatch(updateContract(address)), // update contract with Ashya Device
})


export default connect(
  mapStateToProps,
  mapDispatchToProps)(Wizard) 
