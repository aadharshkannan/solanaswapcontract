const truffleAssert = require('truffle-assertions');

const EmitAndTransfer = artifacts.require("./EmitAndTransfer.sol");
const ERC20PresetFixedSupply = artifacts.require("ERC20PresetFixedSupply");

contract("EmitAndTransfer", accounts => {

  let ERC20Instance = null;

  it("...should deploy the ERC20 mock", async () => {
    ERC20Instance = await ERC20PresetFixedSupply.new(
      "Mock ERC20",
      "M20",
      100000000000,
      accounts[0]
    );
  });

  it("should store and transmit value when referenced.", async () => {

    var solAddr = "SOME_RANDOM_STRING";

    const emitAndTransferInstance = await EmitAndTransfer.new(ERC20Instance.address,
      accounts[0]);

    var intermediary = emitAndTransferInstance.address;
    var initalBalTx  = await ERC20Instance.transfer(accounts[1],500);
    truffleAssert.eventEmitted(initalBalTx, 'Transfer',(ev)=>{
      assert.equal(ev.from,accounts[0],"Transfer from account mismatch");
      assert.equal(ev.to,accounts[1],"Transfer to account mismatch");
      assert.equal(ev.value.toNumber(),500,'akdc count mismatch');

      return true;
    });    

    var authBalTx = await ERC20Instance.approve(intermediary,100,{from:accounts[1]});
    
    truffleAssert.eventEmitted(authBalTx, 'Approval',(ev)=>{
      assert.equal(ev.owner,accounts[1],"Approval consenter account mismatch");
      assert.equal(ev.spender,intermediary,"Approval spender account mismatch");
      assert.equal(ev.value.toNumber(),100,'akdc count mismatch');

      return true;
    }); 
    
    var firstTransfer = await emitAndTransferInstance.registerTransfer(solAddr,10,{from:accounts[1]});
    truffleAssert.eventEmitted(firstTransfer, 'SolTransfer',(ev)=>{
      assert.equal(ev.sender,accounts[1],"Event account mismatch");
      assert.equal(ev.soladdr,solAddr,"SolAddress mismatch");
      assert.equal(ev.akdccnt.toNumber(),10,'akdc count mismatch');

      return true;
    });
    
    var secondTransfer = await emitAndTransferInstance.registerTransfer(solAddr,40,{from:accounts[1]});
    truffleAssert.eventEmitted(secondTransfer, 'SolTransfer',(ev)=>{
      assert.equal(ev.sender,accounts[1],"Event account mismatch");
      assert.equal(ev.soladdr,solAddr,"SolAddress mismatch");
      assert.equal(ev.akdccnt.toNumber(),40,'akdc count mismatch');

      return true;
    });

    var balance = await ERC20Instance.balanceOf(accounts[1]);
    assert.equal(balance.toNumber(),500-50,"The transfer didn't occur after emmision");

    var opCount = await emitAndTransferInstance.latestOp();
    assert.equal(opCount.toNumber(),2,"Op count issue!");

    var firstOpStr = await emitAndTransferInstance.ixAddressLookup(1);
    assert.equal(firstOpStr,solAddr,"Operation 1 Recording Address Issue");
    
    var firstOpFunds = await emitAndTransferInstance.ixFundsLookup(1);
    assert.equal(firstOpFunds.toNumber(),10,"Operation 1 Recording Funds Issue");
   
    var scndOpStr = await emitAndTransferInstance.ixAddressLookup(2);
    assert.equal(scndOpStr,solAddr,"Operation 2 Recording Address Issue");
    
    var scndOpFunds = await emitAndTransferInstance.ixFundsLookup(2);
    assert.equal(scndOpFunds.toNumber(),40,"Operation 2 Recording Funds Issue");
    
  });
});
