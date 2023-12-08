// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Vendor.sol";

contract VendorFactory {
    struct VendorDetails {
        address vendorAddress;
        string name;
        string logo;
    }

    address public owner;
    VendorDetails[] public vendors;

    // Set the deployment cost for creating a new Vendor contract
    // uint256 public constant VENDOR_CREATION_FEE = 1 wei;

    event VendorCreated(
        address indexed vendorAddress,
        string name,
        string logo
    );

    constructor() {
        // The account deploying the contract becomes the owner
        owner = msg.sender;
    }

    function createVendorContract(
        string memory _name,
        string memory _logo
    ) public {
        // Require the sender to send 0.1 ETH
        //require(msg.value == VENDOR_CREATION_FEE, "Must pay 0.1 ETH to create a vendor");

        Vendor newVendor = new Vendor(msg.sender);
        vendors.push(VendorDetails(address(newVendor), _name, _logo));
        emit VendorCreated(address(newVendor), _name, _logo);
    }

    // Function to get list of vendors
    function listVendors() public view returns (VendorDetails[] memory) {
        return vendors;
    }

    // Function to withdraw the collected ETH
    function withdraw() public {
        require(msg.sender == owner, "Only the owner can withdraw");
        payable(owner).transfer(address(this).balance);
    }

    // Function that takes a address and returns if that address is a vendor or not boolean
    function isVendor(address _vendorAddress) public view returns (bool) {
        for (uint i = 0; i < vendors.length; i++) {
            if (vendors[i].vendorAddress == _vendorAddress) {
                return true;
            }
        }
        return false;
    }
}
