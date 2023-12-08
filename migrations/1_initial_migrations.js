const VendorFactory = artifacts.require("VendorFactory");
const Vendor = artifacts.require("Vendor");

module.exports = async function (deployer, network, accounts) {
  if (network === "development") {
    // Deploy the VendorFactory contract
    await deployer.deploy(VendorFactory);
    const vendorFactory = await VendorFactory.deployed();

    // Accounts to use for vendors and products (from Ganache)
    const vendor1Account = accounts[1];
    const vendor2Account = accounts[2];

    // Create vendors
    await vendorFactory.createVendorContract(
      "Nike",
      "https://1000logos.net/wp-content/uploads/2021/11/Nike-Logo.png",
      { from: vendor1Account }
    );
    await vendorFactory.createVendorContract(
      "Addidas",
      "https://seeklogo.com/images/A/adidas-logo-9AA835C1C2-seeklogo.com.png",
      { from: vendor2Account }
    );

    // Get vendor contract instances
    const vendors = await vendorFactory.listVendors();
    const vendor1 = await Vendor.at(vendors[0].vendorAddress);
    const vendor2 = await Vendor.at(vendors[1].vendorAddress);

    // Add products to each vendor
    await vendor1.addProduct(
      "Air Force 1",
      "https://e7.pngegg.com/pngimages/742/799/png-clipart-nike-air-max-sneakers-womens-nike-air-force-1-07-shoe-nike-thumbnail.png",
      web3.utils.toWei("1", "ether"),
      { from: vendor1Account }
    );
    await vendor1.addProduct(
      "Air Jordan 1",
      "https://w7.pngwing.com/pngs/345/549/png-transparent-unpaired-red-and-black-air-jordan-1-shoe-air-jordan-satin-shoe-sneakers-nike-air-jordan-white-suede-outdoor-shoe.png",
      web3.utils.toWei("1.5", "ether"),
      { from: vendor1Account }
    );
    await vendor2.addProduct(
      "Addidas Shoe 1",
      "https://e7.pngegg.com/pngimages/288/894/png-clipart-white-and-black-adidas-superstar-shoes-adidas-superstar-sneakers-shoe-adidas-originals-adidas-white-fashion.png",
      web3.utils.toWei("2", "ether"),
      { from: vendor2Account }
    );
    await vendor2.addProduct(
      "Addidas Shoe 2",
      "https://e7.pngegg.com/pngimages/786/219/png-clipart-adidas-chaussure-gazelle-sports-shoes-mens-adidas-originals-gazelle-adidas-white-outdoor-shoe.png",
      web3.utils.toWei("2.5", "ether"),
      { from: vendor2Account }
    );
  } else if (network === "matic") {
    // Deploy the VendorFactory contract
    await deployer.deploy(VendorFactory);
    const vendorFactory = await VendorFactory.deployed();

    // Accounts to use for vendors and products (from Ganache)
    const vendor1Account = accounts[1];

    // Create vendors
    await vendorFactory.createVendorContract(
      "Nike",
      "https://1000logos.net/wp-content/uploads/2021/11/Nike-Logo.png",
      { from: vendor1Account }
    );

    // Get vendor contract instances
    const vendors = await vendorFactory.listVendors();
    const vendor1 = await Vendor.at(vendors[0].vendorAddress);

    // Add products to each vendor
    await vendor1.addProduct(
      "Air Force 1",
      "https://e7.pngegg.com/pngimages/742/799/png-clipart-nike-air-max-sneakers-womens-nike-air-force-1-07-shoe-nike-thumbnail.png",
      web3.utils.toWei("1", "ether"),
      { from: vendor1Account }
    );
    await vendor1.addProduct(
      "Air Jordan 1",
      "https://w7.pngwing.com/pngs/345/549/png-transparent-unpaired-red-and-black-air-jordan-1-shoe-air-jordan-satin-shoe-sneakers-nike-air-jordan-white-suede-outdoor-shoe.png",
      web3.utils.toWei("1.5", "ether"),
      { from: vendor1Account }
    );
  }
};
