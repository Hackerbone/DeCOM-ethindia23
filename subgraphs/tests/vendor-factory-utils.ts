import { newMockEvent } from "matchstick-as"
import { ethereum, Address } from "@graphprotocol/graph-ts"
import { VendorCreated } from "../generated/VendorFactory/VendorFactory"

export function createVendorCreatedEvent(
  vendorAddress: Address,
  vendorWalletAddress: Address,
  name: string,
  logo: string,
  wantsKYC: boolean
): VendorCreated {
  let vendorCreatedEvent = changetype<VendorCreated>(newMockEvent())

  vendorCreatedEvent.parameters = new Array()

  vendorCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "vendorAddress",
      ethereum.Value.fromAddress(vendorAddress)
    )
  )
  vendorCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "vendorWalletAddress",
      ethereum.Value.fromAddress(vendorWalletAddress)
    )
  )
  vendorCreatedEvent.parameters.push(
    new ethereum.EventParam("name", ethereum.Value.fromString(name))
  )
  vendorCreatedEvent.parameters.push(
    new ethereum.EventParam("logo", ethereum.Value.fromString(logo))
  )
  vendorCreatedEvent.parameters.push(
    new ethereum.EventParam("wantsKYC", ethereum.Value.fromBoolean(wantsKYC))
  )

  return vendorCreatedEvent
}
