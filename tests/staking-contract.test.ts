import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address, BigInt } from "@graphprotocol/graph-ts"
import { StakeEvent, GlobalState, User } from "../generated/schema"
import { handleStaked, handleWithdrawn, handleRewardsClaimed } from "../src/staking-contract"
import { 
  createStakedEvent,
  createWithdrawnEvent,
  createRewardsClaimedEvent
} from "./staking-contract-utils"

describe("Staking DApp Subgraph Tests", () => {
  beforeAll(() => {
    // Clean state before each test suite
    clearStore()
  })

  afterAll(() => {
    clearStore()
  })

  test("Should handle stake event and update user and global state", () => {
    let userAddress = Address.fromString("0x1234567890123456789012345678901234567890")
    let amount = BigInt.fromI32(1000)
    let timestamp = BigInt.fromI32(1634567890)
    let newTotalStaked = BigInt.fromI32(5000)
    let currentRewardRate = BigInt.fromI32(100)

    let stakedEvent = createStakedEvent(
      userAddress,
      amount,
      timestamp,
      newTotalStaked,
      currentRewardRate
    )
    
    handleStaked(stakedEvent)

    // Check if StakeEvent was created
    assert.entityCount("StakeEvent", 1)
    
    // Check if User was created and updated correctly
    assert.entityCount("User", 1)
    assert.fieldEquals("User", userAddress.toHex(), "stakedAmount", "1000")
    assert.fieldEquals("User", userAddress.toHex(), "totalStaked", "1000")

    // Check if GlobalState was updated
    assert.entityCount("GlobalState", 1)
    assert.fieldEquals("GlobalState", "global", "totalStaked", "5000")
    assert.fieldEquals("GlobalState", "global", "currentRewardRate", "100")
    assert.fieldEquals("GlobalState", "global", "totalUniqueStakers", "1")
    assert.fieldEquals("GlobalState", "global", "cumulativeStaked", "1000")
  })

  test("Should handle withdraw event correctly", () => {
    let userAddress = Address.fromString("0x1234567890123456789012345678901234567890")
    let amount = BigInt.fromI32(500)
    let timestamp = BigInt.fromI32(1634567990)
    let newTotalStaked = BigInt.fromI32(4500)
    let currentRewardRate = BigInt.fromI32(100)
    let rewardsAccrued = BigInt.fromI32(50)

    let withdrawnEvent = createWithdrawnEvent(
      userAddress,
      amount,
      timestamp,
      newTotalStaked,
      currentRewardRate,
      rewardsAccrued
    )
    
    handleWithdrawn(withdrawnEvent)

    // Check if WithdrawEvent was created
    assert.entityCount("WithdrawEvent", 1)
    
    // Check if User was updated correctly
    assert.fieldEquals("User", userAddress.toHex(), "stakedAmount", "500")
    assert.fieldEquals("User", userAddress.toHex(), "totalWithdrawn", "500")
    assert.fieldEquals("User", userAddress.toHex(), "pendingRewards", "50")

    // Check if GlobalState was updated
    assert.fieldEquals("GlobalState", "global", "totalStaked", "4500")
  })

  test("Should handle rewards claimed event correctly", () => {
    let userAddress = Address.fromString("0x1234567890123456789012345678901234567890")
    let amount = BigInt.fromI32(50)
    let timestamp = BigInt.fromI32(1634568090)
    let newPendingRewards = BigInt.fromI32(0)
    let totalStaked = BigInt.fromI32(4500)

    let rewardsClaimedEvent = createRewardsClaimedEvent(
      userAddress,
      amount,
      timestamp,
      newPendingRewards,
      totalStaked
    )
    
    handleRewardsClaimed(rewardsClaimedEvent)

    // Check if ClaimEvent was created
    assert.entityCount("ClaimEvent", 1)
    
    // Check if User was updated correctly
    assert.fieldEquals("User", userAddress.toHex(), "pendingRewards", "0")
    assert.fieldEquals("User", userAddress.toHex(), "totalRewardsClaimed", "50")

    // Check if GlobalState was updated
    assert.fieldEquals("GlobalState", "global", "cumulativeRewardsDistributed", "50")
  })
})
