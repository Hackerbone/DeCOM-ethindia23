// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Vendor {
    address public owner;
    uint public productCount = 0;
    uint public orderCount = 0;

    mapping(uint => Product) public products;
    mapping(uint => Order) public orders;

    // Product structure
    struct Product {
        uint id;
        string name;
        string picture;
        uint price;
        bool isAvailable;
    }

    // Order structure
    struct Order {
        uint id;
        uint productId;
        address customer;
        string shippingAddress;
        bool isShipped;
    }

    // Events
    event ProductAdded(uint productId);
    event ProductUpdated(uint productId);
    event ProductRemoved(uint productId);
    event OrderPlaced(uint orderId);
    event OrderUpdated(uint orderId);

    // Constructor sets the contract deployer as the owner
    constructor(address _owner) {
        owner = _owner;
    }

    // Modifier to restrict function access to only the owner
    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }

    // Add a new product to the store
    function addProduct(string memory _name, string memory _picture, uint _price) public onlyOwner {
        productCount++;
        products[productCount] = Product(productCount, _name, _picture, _price, true);
        emit ProductAdded(productCount);
    }

    // Remove a product from the store
    function removeProduct(uint _productId) public onlyOwner {
        products[_productId].isAvailable = false;
        emit ProductRemoved(_productId);
    }

    // Update details of an existing product
    function updateProduct(uint _productId, string memory _name, string memory _picture, uint _price) public onlyOwner {
        Product storage product = products[_productId];
        product.name = _name;
        product.picture = _picture;
        product.price = _price;
        emit ProductUpdated(_productId);
    }

    // Place an order for a product
    function placeOrder(uint _productId, string memory _shippingAddress) public payable {
        require(products[_productId].isAvailable, "Product not available");
        require(msg.value >= products[_productId].price, "Insufficient payment");

        orderCount++;
        orders[orderCount] = Order(orderCount, _productId, msg.sender, _shippingAddress, false);
        emit OrderPlaced(orderCount);
    }

    // Track details of a specific order
    function trackOrder(uint _orderId) public view returns (Order memory) {
        require(orders[_orderId].customer == msg.sender, "Not your order");
        return orders[_orderId];
    }

    // Get a list of all available products
    function getProductList() public view returns (Product[] memory) {
        Product[] memory productList = new Product[](productCount);
        for (uint i = 0; i < productCount; i++) {
            if (products[i + 1].isAvailable) {
                productList[i] = products[i + 1];
            }
        }
        return productList;
    }

    // Withdraw the earned wei from contract to the owner's address
    function withdraw() public onlyOwner {
        uint balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        payable(owner).transfer(balance);
    }

    // Additional functions and security measures can be added as needed
}