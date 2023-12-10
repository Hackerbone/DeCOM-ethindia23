import { VendorCreated as VendorCreatedEvent } from "../generated/VendorFactory/VendorFactory"
import { VendorCreated } from "../generated/schema"

export function handleVendorCreated(event: VendorCreatedEvent): void {
  let entity = new VendorCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.vendorAddress = event.params.vendorAddress
  entity.vendorWalletAddress = event.params.vendorWalletAddress
  entity.name = event.params.name
  entity.logo = event.params.logo
  entity.wantsKYC = event.params.wantsKYC

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
