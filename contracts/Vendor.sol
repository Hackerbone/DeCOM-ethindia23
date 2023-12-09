// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Vendor {
    address public owner;
    uint public productCount = 0;
    uint public orderCount = 0;
    bool public wantsKYC = false;

    mapping(uint => Product) public products;
    mapping(uint => Order) public orders;

    mapping(address => bool) public aadharVerified;

    // Product structure
    struct Product {
        uint id;
        string name;
        string picture;
        uint price;
        bool isAvailable;
        string category;
    }

    // Order structure
    struct Order {
        uint id;
        uint productId;
        address customer;
        string encryptedData;
        bool isShipped;
        bool isLighthouse;
    }

    // Events
    event ProductAdded(uint productId);
    event ProductUpdated(uint productId);
    event ProductRemoved(uint productId);
    event OrderPlaced(uint orderId);
    event OrderUpdated(uint orderId);

    // Constructor sets the contract deployer as the owner
    constructor(address _owner, bool _wantsKYC) {
        owner = _owner;
        wantsKYC = _wantsKYC;
    }

    // Modifier to restrict function access to only the owner
    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }

    // Add a new product to the store
    function addProduct(
        string memory _name,
        string memory _picture,
        string memory _category,
        uint _price
    ) public onlyOwner {
        productCount++;
        products[productCount] = Product(
            productCount,
            _name,
            _picture,
            _price,
            true,
            _category
        );
        emit ProductAdded(productCount);
    }

    // Remove a product from the store
    function removeProduct(uint _productId) public onlyOwner {
        products[_productId].isAvailable = false;
        emit ProductRemoved(_productId);
    }

    // Update details of an existing product
    function updateProduct(
        uint _productId,
        string memory _name,
        string memory _picture,
        string memory _category,
        uint _price
    ) public onlyOwner {
        Product storage product = products[_productId];
        product.name = _name;
        product.picture = _picture;
        product.price = _price;
        product.category = _category;
        emit ProductUpdated(_productId);
    }

    // Place an order for a product
    function placeOrder(
        uint _productId,
        string memory _encryptedData,
        bool _isLighthouse
    ) public payable {
        require(products[_productId].isAvailable, "Product not available");
        require(
            msg.value >= products[_productId].price,
            "Insufficient payment"
        );

        Order memory newOrder = Order(
            orderCount,
            _productId,
            msg.sender,
            _encryptedData,
            false,
            _isLighthouse
        );

        orders[orderCount] = newOrder;
        orderCount++;
        emit OrderPlaced(orderCount - 1);
    }

    //update order shipping status
    function updateOrderToShipped(uint _orderId) public onlyOwner {
        orders[_orderId].isShipped = true;
        emit OrderUpdated(_orderId);
    }

    // Track details of a specific order
    function trackOrder(uint _orderId) public view returns (Order memory) {
        require(orders[_orderId].customer == msg.sender, "Not your order");
        return orders[_orderId];
    }

    // get all orders of the vendor
    function getOrders() public view returns (Order[] memory) {
        Order[] memory orderList = new Order[](orderCount);
        for (uint i = 0; i < orderCount; i++) {
            orderList[i] = orders[i];
        }
        return orderList;
    }

    // get all order of a customer using customer address
    function getOrdersByCustomer(
        address _customer
    ) public view returns (Order[] memory) {
        Order[] memory orderList = new Order[](orderCount);
        for (uint i = 0; i < orderCount; i++) {
            if (orders[i].customer == _customer) {
                orderList[i] = orders[i];
            }
        }
        return orderList;
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

    // aadhar verified set to true for a customer
    function setAadharVerified(address _customer) public onlyOwner {
        aadharVerified[_customer] = true;
    }

    // get aadhar verified status of a customer
    function getAadharVerified(address _customer) public view returns (bool) {
        return aadharVerified[_customer];
    }

    // set kyc requirement to true/false
    function setKYC(bool _wantsKYC) public onlyOwner {
        wantsKYC = _wantsKYC;
    }

    // function to get all wallet addresses of customers who have placed orders, remove duplicates
    function getCustomers() public view returns (address[] memory) {
        address[] memory customerList = new address[](orderCount);
        for (uint i = 0; i < orderCount; i++) {
            customerList[i] = orders[i].customer;
        }
        return customerList;
    }

    // function to check if a address has placed an order or not
    function isCustomer(address _customer) public view returns (bool) {
        for (uint i = 0; i < orderCount; i++) {
            if (orders[i].customer == _customer) {
                return true;
            }
        }
        return false;
    }
}
