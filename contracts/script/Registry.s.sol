// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import "../src/Registry.sol";

contract RegistryScript is Script {
    Registry registry;

    function run() public {
        vm.broadcast();
        registry = new Registry();
    }
}
