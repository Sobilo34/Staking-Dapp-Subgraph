import {
  RewardRateUpdated as RewardRateUpdatedEvent,
  RewardsClaimed as RewardsClaimedEvent,
  Staked as StakedEvent,
  StakingInitialized as StakingInitializedEvent,
  Withdrawn as WithdrawnEvent,
  EmergencyWithdrawn as EmergencyWithdrawnEvent
} from "../generated/StakingContract/StakingContract"

import {
  GlobalState,
  User,
  Stake,
  Withdraw,
  Claim,
  RewardRateUpdate,
  EmergencyWithdraw
} from "../generated/schema"

import { Address, BigInt } from "@graphprotocol/graph-ts"

const GLOBAL_ID = "global"


function getGlobalState(): GlobalState {
  let global = GlobalState.load(GLOBAL_ID)
  if (global == null) {
    global = new GlobalState(GLOBAL_ID)
    global.totalStaked = BigInt.zero()
    global.currentRewardRate = BigInt.zero()
    global.lastUpdateTimestamp = BigInt.zero()
    global.totalUniqueStakers = BigInt.zero()
    global.cumulativeStaked = BigInt.zero()
    global.cumulativeRewardsDistributed = BigInt.zero()
    global.stakingToken = null
    global.save()
  }
  return global as GlobalState
}

function getUser(address: Address): User {
  let user = User.load(address)
  if (user == null) {
    user = new User(address)
    user.stakedAmount = BigInt.zero()
    user.pendingRewards = BigInt.zero()
    user.lastStakeTimestamp = BigInt.zero()
    user.totalStaked = BigInt.zero()
    user.totalWithdrawn = BigInt.zero()
    user.totalRewardsClaimed = BigInt.zero()
    user.lastUpdateTimestamp = BigInt.zero()
    
    let global = getGlobalState()
    global.totalUniqueStakers = global.totalUniqueStakers.plus(BigInt.fromI32(1))
    global.save()
  }
  return user as User
}

export function handleStakingInitialized(event: StakingInitializedEvent): void {
  let global = getGlobalState()
  global.stakingToken = event.params.stakingToken
  global.currentRewardRate = event.params.initialRewardRate
  global.lastUpdateTimestamp = event.block.timestamp
  global.save()
}

export function handleStaked(event: StakedEvent): void {
  let stakeEvent = new Stake(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  
  let user = getUser(event.params.user)
  stakeEvent.user = user.id
  stakeEvent.amount = event.params.amount
  stakeEvent.timestamp = event.params.timestamp
  stakeEvent.totalStaked = event.params.newTotalStaked
  stakeEvent.blockNumber = event.block.number
  stakeEvent.transactionHash = event.transaction.hash
  stakeEvent.save()

  user.stakedAmount = user.stakedAmount.plus(event.params.amount)
  user.totalStaked = user.totalStaked.plus(event.params.amount)
  user.lastStakeTimestamp = event.params.timestamp
  user.lastUpdateTimestamp = event.block.timestamp
  user.save()

  let global = getGlobalState()
  global.totalStaked = event.params.newTotalStaked
  global.currentRewardRate = event.params.currentRewardRate
  global.cumulativeStaked = global.cumulativeStaked.plus(event.params.amount)
  global.lastUpdateTimestamp = event.block.timestamp
  global.save()
}

export function handleWithdrawn(event: WithdrawnEvent): void {
  let withdrawEvent = new Withdraw(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  
  let user = getUser(event.params.user)
  withdrawEvent.user = user.id
  withdrawEvent.amount = event.params.amount
  withdrawEvent.timestamp = event.params.timestamp
  withdrawEvent.totalStaked = event.params.newTotalStaked
  withdrawEvent.rewardsAccrued = event.params.rewardsAccrued
  withdrawEvent.blockNumber = event.block.number
  withdrawEvent.transactionHash = event.transaction.hash
  withdrawEvent.save()

  user.stakedAmount = user.stakedAmount.minus(event.params.amount)
  user.totalWithdrawn = user.totalWithdrawn.plus(event.params.amount)
  user.pendingRewards = user.pendingRewards.plus(event.params.rewardsAccrued)
  user.lastUpdateTimestamp = event.block.timestamp
  user.save()

  let global = getGlobalState()
  global.totalStaked = event.params.newTotalStaked
  global.currentRewardRate = event.params.currentRewardRate
  global.lastUpdateTimestamp = event.block.timestamp
  global.save()
}

export function handleRewardsClaimed(event: RewardsClaimedEvent): void {
  let claimEvent = new Claim(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  
  let user = getUser(event.params.user)
  claimEvent.user = user.id
  claimEvent.amount = event.params.amount
  claimEvent.timestamp = event.params.timestamp
  claimEvent.blockNumber = event.block.number
  claimEvent.transactionHash = event.transaction.hash
  claimEvent.save()

  user.pendingRewards = event.params.newPendingRewards
  user.totalRewardsClaimed = user.totalRewardsClaimed.plus(event.params.amount)
  user.lastUpdateTimestamp = event.block.timestamp
  user.save()

  let global = getGlobalState()
  global.totalStaked = event.params.totalStaked
  global.cumulativeRewardsDistributed = global.cumulativeRewardsDistributed.plus(event.params.amount)
  global.lastUpdateTimestamp = event.block.timestamp
  global.save()
}

export function handleRewardRateUpdated(event: RewardRateUpdatedEvent): void {
  let rateUpdateEvent = new RewardRateUpdate(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  rateUpdateEvent.oldRate = event.params.oldRate
  rateUpdateEvent.newRate = event.params.newRate
  rateUpdateEvent.timestamp = event.params.timestamp
  rateUpdateEvent.blockNumber = event.block.number
  rateUpdateEvent.transactionHash = event.transaction.hash
  rateUpdateEvent.save()

  let global = getGlobalState()
  global.currentRewardRate = event.params.newRate
  global.totalStaked = event.params.totalStaked
  global.lastUpdateTimestamp = event.block.timestamp
  global.save()
}

export function handleEmergencyWithdrawn(event: EmergencyWithdrawnEvent): void {
  let emergencyWithdrawEvent = new EmergencyWithdraw(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  
  let user = getUser(event.params.user)
  emergencyWithdrawEvent.user = user.id
  emergencyWithdrawEvent.amount = event.params.amount
  emergencyWithdrawEvent.penalty = event.params.penalty
  emergencyWithdrawEvent.timestamp = event.params.timestamp
  emergencyWithdrawEvent.totalStaked = event.params.newTotalStaked
  emergencyWithdrawEvent.blockNumber = event.block.number
  emergencyWithdrawEvent.transactionHash = event.transaction.hash
  emergencyWithdrawEvent.save()
  
  user.stakedAmount = BigInt.zero()
  user.pendingRewards = BigInt.zero()
  user.totalWithdrawn = user.totalWithdrawn.plus(event.params.amount)
  user.lastUpdateTimestamp = event.block.timestamp
  user.save()

  let global = getGlobalState()
  global.totalStaked = event.params.newTotalStaked
  global.lastUpdateTimestamp = event.block.timestamp
  global.save()
}
