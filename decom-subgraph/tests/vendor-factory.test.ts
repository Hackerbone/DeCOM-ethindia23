import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address } from "@graphprotocol/graph-ts"
import { VendorCreated } from "../generated/schema"
import { VendorCreated as VendorCreatedEvent } from "../generated/VendorFactory/VendorFactory"
import { handleVendorCreated } from "../src/vendor-factory"
import { createVendorCreatedEvent } from "./vendor-factory-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let vendorAddress = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let vendorWalletAddress = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let name = "Example string value"
    let logo = "Example string value"
    let wantsKYC = "boolean Not implemented"
    let newVendorCreatedEvent = createVendorCreatedEvent(
      vendorAddress,
      vendorWalletAddress,
      name,
      logo,
      wantsKYC
    )
    handleVendorCreated(newVendorCreatedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("VendorCreated created and stored", () => {
    assert.entityCount("VendorCreated", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "VendorCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "vendorAddress",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "VendorCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "vendorWalletAddress",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "VendorCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "name",
      "Example string value"
    )
    assert.fieldEquals(
      "VendorCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "logo",
      "Example string value"
    )
    assert.fieldEquals(
      "VendorCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "wantsKYC",
      "boolean Not implemented"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
