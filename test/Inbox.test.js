const assert = require('assert');
const ganache = require('ganache-cli');
const provider = ganache.provider();

const Web3 = require('web3');

const { interface, bytecode } = require('../compile')

const OPTIONS = {
    defaultBlock: "latest",
    transactionConfirmationBlocks: 1,
    transactionBlockTimeout: 5
  };

  const web3 = new Web3(ganache.provider(), null, OPTIONS);

let accounts;
let inbox;
const INITIAL_STRING = 'Hi there!';
beforeEach( async () => {
    //Get a list of all accounts
   accounts = await web3.eth.getAccounts();

    //use one of those accounts to deploy the contract
    inbox = await new web3.eth.Contract(JSON.parse(interface))
                    .deploy({data: bytecode, arguments: [INITIAL_STRING]})
                    .send({from: accounts[0],gas:'1000000' })
//    inbox.setProvider(provider);

});

describe('Inbox',()=>{

    it('deploys a contract',()=> {
        assert.ok(inbox.options.address);
    });

    it('has a default message', async ()=>{
        const message = await inbox.methods.message().call();
        assert.equal(message, 'Hi there!');
    });

    it('can change the message', async()=>{
        await inbox.methods.setMessage('bye').send({from: accounts[0] })

        const message = await inbox.methods.message().call();

        assert.equal(message, 'bye');

    });
});