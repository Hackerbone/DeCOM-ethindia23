// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Vendor.sol";

contract VendorFactory {
    struct VendorDetails {
        address vendorAddress;
        address vendorWalletAddress;
        string name;
        string logo;
        bool wantsKYC;
    }

    address public owner;
    VendorDetails[] public vendors;

    // Set the deployment cost for creating a new Vendor contract
    // uint256 public constant VENDOR_CREATION_FEE = 1 wei;

    event VendorCreated(
        address indexed vendorAddress,
        address vendorWalletAddress,
        string name,
        string logo,
        bool wantsKYC
    );

    constructor() {
        // The account deploying the contract becomes the owner
        owner = msg.sender;
    }

    function createVendorContract(
        string memory _name,
        string memory _logo,
        bool _wantsKYC
    ) public {
        // Require the sender to send 0.1 ETH
        //require(msg.value == VENDOR_CREATION_FEE, "Must pay 0.1 ETH to create a vendor");

        Vendor newVendor = new Vendor(msg.sender, _wantsKYC);
        vendors.push(
            VendorDetails(
                address(newVendor),
                address(msg.sender),
                _name,
                _logo,
                _wantsKYC
            )
        );
        emit VendorCreated(
            address(newVendor),
            address(msg.sender),
            _name,
            _logo,
            _wantsKYC
        );
    }

    // Function to get list of vendors
    function listVendors() public view returns (VendorDetails[] memory) {
        return vendors;
    }

    // Function to get a vendor by their wallet address, if does not exist, return empty VendorDetails
    function getVendorByWalletAddress(
        address _vendorWalletAddress
    ) public view returns (VendorDetails memory) {
        for (uint256 i = 0; i < vendors.length; i++) {
            if (vendors[i].vendorWalletAddress == _vendorWalletAddress) {
                return vendors[i];
            }
        }
        revert("Vendor not found");
    }

    // Function to withdraw the collected ETH
    function withdraw() public {
        require(msg.sender == owner, "Only the owner can withdraw");
        payable(owner).transfer(address(this).balance);
    }
}
