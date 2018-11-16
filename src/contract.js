// The ABI of the contract we will be creating. 
// Two variables are needed, each from the same contract.  
//export const bytecode
//export const abiArray
//export const registryAddress = "0x345ca3e014aaf5dca488057592ee47305d9b3e10"
export const registryAddress = "0x345ca3e014aaf5dca488057592ee47305d9b3e10"
export const bytecode = "0x6080604052662386f26fc1000060005534801561001b57600080fd5b506040516108bc3803806108bc83398101806040528101908080518201929190602001805182019291906020018051820192919050505033600560006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555082600190805190602001906100a99291906100e0565b5081600290805190602001906100c09291906100e0565b5080600390805190602001906100d79291906100e0565b50505050610185565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061012157805160ff191683800117855561014f565b8280016001018555821561014f579182015b8281111561014e578251825591602001919060010190610133565b5b50905061015c9190610160565b5090565b61018291905b8082111561017e576000816000905550600101610166565b5090565b90565b610728806101946000396000f30060806040526004361061006d576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680636dc7b9a514610072578063796676be146100a85780638da5cb5b1461014e578063d103449c146101a5578063e3cda82314610201575b600080fd5b6100a6600480360381019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919050505061022c565b005b3480156100b457600080fd5b506100d360048036038101908080359060200190929190505050610516565b6040518080602001828103825283818151815260200191508051906020019080838360005b838110156101135780820151818401526020810190506100f8565b50505050905090810190601f1680156101405780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b34801561015a57600080fd5b506101636105d1565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b6101ff600480360381019080803590602001908201803590602001908080601f01602080910402602001604051908101604052809392919081815260200183838082843782019150505050505091929192905050506105f7565b005b34801561020d57600080fd5b5061021661064a565b6040518082815260200191505060405180910390f35b600560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614151561028857600080fd5b80600660006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550600660009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663339ba349662386f26fc100006001600260036040518563ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808060200180602001806020018481038452878181546001816001161561010002031660029004815260200191508054600181600116156101000203166002900480156103d15780601f106103a6576101008083540402835291602001916103d1565b820191906000526020600020905b8154815290600101906020018083116103b457829003601f168201915b50508481038352868181546001816001161561010002031660029004815260200191508054600181600116156101000203166002900480156104545780601f1061042957610100808354040283529160200191610454565b820191906000526020600020905b81548152906001019060200180831161043757829003601f168201915b50508481038252858181546001816001161561010002031660029004815260200191508054600181600116156101000203166002900480156104d75780601f106104ac576101008083540402835291602001916104d7565b820191906000526020600020905b8154815290600101906020018083116104ba57829003601f168201915b505096505050505050506000604051808303818588803b1580156104fa57600080fd5b505af115801561050e573d6000803e3d6000fd5b505050505050565b60048181548110151561052557fe5b906000526020600020016000915090508054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156105c95780601f1061059e576101008083540402835291602001916105c9565b820191906000526020600020905b8154815290600101906020018083116105ac57829003601f168201915b505050505081565b600560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600054341015151561060857600080fd5b6004819080600181540180825580915050906001820390600052602060002001600090919290919091509080519060200190610645929190610657565b505050565b6000600480549050905090565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061069857805160ff19168380011785556106c6565b828001600101855582156106c6579182015b828111156106c55782518255916020019190600101906106aa565b5b5090506106d391906106d7565b5090565b6106f991905b808211156106f55760008160009055506001016106dd565b5090565b905600a165627a7a7230582093d3ba14c2a2d91795ae11ffb181ffbb40f30a2fa6ba338a47cb7288811f29ee0029"

export const abiArray = [  
  {
      "constant": true,
      "inputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "urls",
      "outputs": [
        {
          "name": "",
          "type": "string"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "name": "_name",
          "type": "string"
        },
        {
          "name": "_location",
          "type": "string"
        },
        {
          "name": "_url",
          "type": "string"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "registryAddress",
          "type": "address"
        }
      ],
      "name": "registerDevice",
      "outputs": [],
      "payable": true,
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "newUrl",
          "type": "string"
        }
      ],
      "name": "addURL",
      "outputs": [],
      "payable": true,
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "getURLCount",
      "outputs": [
        {
          "name": "count",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    }
  ]

