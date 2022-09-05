// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import {UrlEntry, Registry} from "../src/Registry.sol";

contract RegistryTest is Test {
    Registry public registry;

    function setUp() public {
        registry = new Registry();
    }

    function testRegister() public {
        bytes32 uname = bytes32("harry");

        registry.register(uname, "https://example.com/u/harry/data.json");

        UrlEntry memory urlEntry = registry.lookupUser(uname);
        string memory url = urlEntry.url;
        bool initialized = urlEntry.initialized;

        emit log(url);

        assertEq(url, "https://example.com/u/harry/data.json");
        assertEq(initialized, true);
    }
}
