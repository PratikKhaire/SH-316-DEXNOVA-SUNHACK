// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Script} from "forge-std/Script.sol";
import {console2} from "forge-std/console2.sol";
import {LandLedger} from "../src/LandLedger.sol";

contract DeployLandLedgerScript is Script {
    function run() public {
        // This will be resolved by the --from flag.
        vm.startBroadcast();

        // Deploy the contract.
        LandLedger landLedger = new LandLedger();

        // Log the deployed address.
        console2.log("LandLedger contract deployed at:", address(landLedger));

        // Stop broadcasting.
        vm.stopBroadcast();
    }
}
