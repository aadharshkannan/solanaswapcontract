const EmitAndTransfer = artifacts.require("EmitAndTransfer");
const prevdeployment = require('../assets/deployment.json');

module.exports = function (deployer) {
  deployer.deploy(EmitAndTransfer,
    prevdeployment.erc20address,
    prevdeployment.owneraddress);
};
