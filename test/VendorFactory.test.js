const VendorFactory = artifacts.require("VendorFactory");
const Vendor = artifacts.require("Vendor");

contract("VendorFactory", async (accounts) => {
  let vendorFactory;
  let vendor1, vendor2;
  let product1Id, product2Id, product3Id, product4Id;

  const vendorFactoryOwnerAccount = accounts[0];
  const vendor1Account = accounts[1];
  const vendor2Account = accounts[2];
  const buyer1Account = accounts[3];
  const buyer2Account = accounts[4];

  beforeEach(async () => {
    vendorFactory = await VendorFactory.new({
      from: vendorFactoryOwnerAccount,
    });

    // Initialize two vendors
    await vendorFactory.createVendorContract("Vendor1", "Vendor1 Logo", true, {
      from: vendor1Account,
    });
    await vendorFactory.createVendorContract("Vendor2", "Vendor2 Logo", false, {
      from: vendor2Account,
    });

    const vendors = await vendorFactory.listVendors();
    vendor1 = await Vendor.at(vendors[0].vendorAddress);
    vendor2 = await Vendor.at(vendors[1].vendorAddress);

    // Add two random products to each vendor
    let result = await vendor1.addProduct(
      "Product1",
      "Picture1",
      "Category1",
      web3.utils.toWei("1", "ether"),
      { from: vendor1Account }
    );
    product1Id = result.logs[0].args.productId;
    result = await vendor1.addProduct(
      "Product2",
      "Picture2",
      "Category2",
      web3.utils.toWei("1.5", "ether"),
      { from: vendor1Account }
    );
    product2Id = result.logs[0].args.productId;
    result = await vendor2.addProduct(
      "Product3",
      "Picture3",
      "Category3",
      web3.utils.toWei("2", "ether"),
      { from: vendor2Account }
    );
    product3Id = result.logs[0].args.productId;
    result = await vendor2.addProduct(
      "Product4",
      "Picture4",
      "Category4",
      web3.utils.toWei("2.5", "ether"),
      { from: vendor2Account }
    );
    product4Id = result.logs[0].args.productId;
  });

  it("should deploy VendorFactory", async () => {
    const vendorFactory = await VendorFactory.deployed();
    assert(vendorFactory.address !== "");
  });

  it("should create two Vendor contracts", async () => {
    const vendors = await vendorFactory.listVendors();
    assert.equal(vendors.length, 2, "VendorFactory should have two vendors");
    assert.equal(
      vendors[0].name,
      "Vendor1",
      "Vendor1 should be the first vendor"
    );
    assert.equal(
      vendors[1].name,
      "Vendor2",
      "Vendor2 should be the second vendor"
    );
  });

  it("should add two products to each vendor", async () => {
    // just check if both vendors have 2 products each
    let vendor1Products = await vendor1.getProductList();
    assert.equal(vendor1Products.length, 2, "Vendor1 should have two products");
    let vendor2Products = await vendor1.getProductList();
    assert.equal(vendor2Products.length, 2, "Vendor2 should have two products");
  });

  //test the getCustomers function that to get all wallet addresses of customers who have placed orders
  it("should get all customers who have placed orders", async () => {
    // Buyer 1 purchases one product from each vendor
    await vendor1.placeOrder(product1Id, "EncryptedAddress1", false, {
      from: buyer1Account,
      value: web3.utils.toWei("1", "ether"),
    });
    await vendor2.placeOrder(product3Id, "EncryptedAddress3", true, {
      from: buyer1Account,
      value: web3.utils.toWei("2", "ether"),
    });

    // Buyer 2 purchases one product from each vendor
    await vendor1.placeOrder(product2Id, "EncryptedAddress2", false, {
      from: buyer2Account,
      value: web3.utils.toWei("1.5", "ether"),
    });
    await vendor2.placeOrder(product4Id, "EncryptedAddress4", true, {
      from: buyer2Account,
      value: web3.utils.toWei("2.5", "ether"),
    });

    // Check the customers who have placed orders
    let customers = await vendor1.getCustomers();
    assert.equal(customers.length, 2, "Vendor 1 should have two customers");

    assert.equal(
      customers[0],
      buyer1Account,
      "Buyer1 should be the first customer"
    );

    assert.equal(
      customers[1],
      buyer2Account,
      "Buyer2 should be the second customer"
    );
  });

  it("should allow buyers to purchase products", async () => {
    const vendors = await vendorFactory.listVendors();
    vendor1 = await Vendor.at(vendors[0].vendorAddress);
    vendor2 = await Vendor.at(vendors[1].vendorAddress);

    // Buyer 1 purchases one product from each vendor
    await vendor1.placeOrder(product1Id, "EncryptedAddress1", false, {
      from: buyer1Account,
      value: web3.utils.toWei("1", "ether"),
    });
    await vendor2.placeOrder(product3Id, "EncryptedAddress3", true, {
      from: buyer1Account,
      value: web3.utils.toWei("2", "ether"),
    });

    // Buyer 2 purchases one product from each vendor
    await vendor1.placeOrder(product2Id, "EncryptedAddress2", false, {
      from: buyer2Account,
      value: web3.utils.toWei("1.5", "ether"),
    });
    await vendor2.placeOrder(product4Id, "EncryptedAddress4", true, {
      from: buyer2Account,
      value: web3.utils.toWei("2.5", "ether"),
    });

    // Assertions to validate the purchase outcomes
    // Check orders for buyer1
    let order1 = await vendor1.trackOrder(product1Id, { from: buyer1Account });
    assert.equal(
      order1.customer,
      buyer1Account,
      "Buyer1 should have an order with vendor1"
    );
    assert.equal(
      order1.productId,
      product1Id,
      "Buyer1 should have purchased Product1"
    );

    let order2 = await vendor2.trackOrder(product3Id, { from: buyer1Account });
    assert.equal(
      order2.customer,
      buyer1Account,
      "Buyer1 should have an order with vendor2"
    );
    assert.equal(
      order2.productId,
      product3Id,
      "Buyer1 should have purchased Product3"
    );

    // Check orders for buyer2
    let order3 = await vendor1.trackOrder(product2Id, { from: buyer2Account });
    assert.equal(
      order3.customer,
      buyer2Account,
      "Buyer2 should have an order with vendor1"
    );
    assert.equal(
      order3.productId,
      product2Id,
      "Buyer2 should have purchased Product2"
    );

    let order4 = await vendor2.trackOrder(product4Id, { from: buyer2Account });
    assert.equal(
      order4.customer,
      buyer2Account,
      "Buyer2 should have an order with vendor2"
    );
    assert.equal(
      order4.productId,
      product4Id,
      "Buyer2 should have purchased Product4"
    );

    // Check balances of Vendor Contracts
    let balanceVendor1 = await web3.eth.getBalance(vendor1.address);
    assert.equal(
      balanceVendor1,
      web3.utils.toWei("2.5", "ether"),
      "Vendor1's balance should be updated"
    );

    let balanceVendor2 = await web3.eth.getBalance(vendor2.address);
    assert.equal(
      balanceVendor2,
      web3.utils.toWei("4.5", "ether"),
      "Vendor2's balance should be updated"
    );
  });
});
