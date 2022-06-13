// SPDX-License-Identifier: MIT
pragma solidity 0.8.14;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract EmitAndTransfer{
    
    address contractAddress;
    address ownerAddress;
    uint265 public opcounter;

    mapping (uint265=>string) solanaaddress;
    mapping (uint265=>uint256) funds;

    constructor(address _contractAddress, address _ownerAddress){
        contractAddress = _contractAddress;
        ownerAddress = _ownerAddress;
    }

    function latestOp() external view returns(uint256)
    {
        return opcounter;
    }

    function ixAddressLookup(uint256 ix) external view returns(address)
    {
        return solanaaddress[ix];
    }

    function ixFundsLookup(uint256 ix) external view returns(uint256)
    {
        return funds[ix];       
    }

    function registerTransfer(string soladdr,uint256 akdccnt) external returns(bool)
    {
        IERC20(contractAddress).transferFrom(msg.sender,ownerAddress, akdccnt);
        opcounter = opcounter +1;
        solanaaddress[opcounter] = soladdr;
        akdccnt[opcounter] = akdccnt;

        emit SolTransfer(msg.sender,soladdr,akdccnt);

        return true;
    }
}