#!/bin/bash

# Remove the build and src/abis directories
rm -rf build/
rm -rf src/abis/

echo "Building contracts..."
# Run truffle deploy and capture the output
DEPLOY_OUTPUT=$(truffle deploy)

echo "Copying ABIs..."
# Extract the contract address
# Adjust the pattern to match your contract deployment output
CONTRACT_ADDRESS=$(echo "$DEPLOY_OUTPUT" | grep 'contract address:' | awk '{print $NF}')

echo "Writing contract address to .env file..."
# Check if the contract address was found
if [ -z "$CONTRACT_ADDRESS" ]; then
    echo "Contract address not found"
    exit 1
fi

# Update .env file with the new contract address
echo "REACT_APP_GLOBAL_CONTRACT_ADDRESS=$CONTRACT_ADDRESS" > .env

# Print success message
echo "Deployment successful. Contract Address: $CONTRACT_ADDRESS"
