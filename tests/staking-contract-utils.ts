import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  Staked,
  Withdrawn,
  RewardsClaimed,
  RewardRateUpdated,
  StakingInitialized
} from "../generated/StakingContract/StakingContract"

export function createStakedEvent(
  user: Address,
  amount: BigInt,
  timestamp: BigInt,
  newTotalStaked: BigInt,
  currentRewardRate: BigInt
): Staked {
  let stakedEvent = changetype<Staked>(newMockEvent())

  stakedEvent.parameters = new Array()

  stakedEvent.parameters.push(
    new ethereum.EventParam("user", ethereum.Value.fromAddress(user))
  )
  stakedEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )
  stakedEvent.parameters.push(
    new ethereum.EventParam("timestamp", ethereum.Value.fromUnsignedBigInt(timestamp))
  )
  stakedEvent.parameters.push(
    new ethereum.EventParam("newTotalStaked", ethereum.Value.fromUnsignedBigInt(newTotalStaked))
  )
  stakedEvent.parameters.push(
    new ethereum.EventParam("currentRewardRate", ethereum.Value.fromUnsignedBigInt(currentRewardRate))
  )

  return stakedEvent
}

export function createWithdrawnEvent(
  user: Address,
  amount: BigInt,
  timestamp: BigInt,
  newTotalStaked: BigInt,
  currentRewardRate: BigInt,
  rewardsAccrued: BigInt
): Withdrawn {
  let withdrawnEvent = changetype<Withdrawn>(newMockEvent())

  withdrawnEvent.parameters = new Array()

  withdrawnEvent.parameters.push(
    new ethereum.EventParam("user", ethereum.Value.fromAddress(user))
  )
  withdrawnEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )
  withdrawnEvent.parameters.push(
    new ethereum.EventParam("timestamp", ethereum.Value.fromUnsignedBigInt(timestamp))
  )
  withdrawnEvent.parameters.push(
    new ethereum.EventParam("newTotalStaked", ethereum.Value.fromUnsignedBigInt(newTotalStaked))
  )
  withdrawnEvent.parameters.push(
    new ethereum.EventParam("currentRewardRate", ethereum.Value.fromUnsignedBigInt(currentRewardRate))
  )
  withdrawnEvent.parameters.push(
    new ethereum.EventParam("rewardsAccrued", ethereum.Value.fromUnsignedBigInt(rewardsAccrued))
  )

  return withdrawnEvent
}

export function createRewardsClaimedEvent(
  user: Address,
  amount: BigInt,
  timestamp: BigInt,
  newPendingRewards: BigInt,
  totalStaked: BigInt
): RewardsClaimed {
  let rewardsClaimedEvent = changetype<RewardsClaimed>(newMockEvent())

  rewardsClaimedEvent.parameters = new Array()

  rewardsClaimedEvent.parameters.push(
    new ethereum.EventParam("user", ethereum.Value.fromAddress(user))
  )
  rewardsClaimedEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )
  rewardsClaimedEvent.parameters.push(
    new ethereum.EventParam("timestamp", ethereum.Value.fromUnsignedBigInt(timestamp))
  )
  rewardsClaimedEvent.parameters.push(
    new ethereum.EventParam("newPendingRewards", ethereum.Value.fromUnsignedBigInt(newPendingRewards))
  )
  rewardsClaimedEvent.parameters.push(
    new ethereum.EventParam("totalStaked", ethereum.Value.fromUnsignedBigInt(totalStaked))
  )

  return rewardsClaimedEvent
}

export function createRewardRateUpdatedEvent(
  oldRate: BigInt,
  newRate: BigInt,
  timestamp: BigInt,
  totalStaked: BigInt
): RewardRateUpdated {
  let rewardRateUpdatedEvent = changetype<RewardRateUpdated>(newMockEvent())

  rewardRateUpdatedEvent.parameters = new Array()

  rewardRateUpdatedEvent.parameters.push(
    new ethereum.EventParam("oldRate", ethereum.Value.fromUnsignedBigInt(oldRate))
  )
  rewardRateUpdatedEvent.parameters.push(
    new ethereum.EventParam("newRate", ethereum.Value.fromUnsignedBigInt(newRate))
  )
  rewardRateUpdatedEvent.parameters.push(
    new ethereum.EventParam("timestamp", ethereum.Value.fromUnsignedBigInt(timestamp))
  )
  rewardRateUpdatedEvent.parameters.push(
    new ethereum.EventParam("totalStaked", ethereum.Value.fromUnsignedBigInt(totalStaked))
  )

  return rewardRateUpdatedEvent
}

export function createStakingInitializedEvent(
  stakingToken: Address,
  initialRewardRate: BigInt,
  timestamp: BigInt
): StakingInitialized {
  let stakingInitializedEvent = changetype<StakingInitialized>(newMockEvent())

  stakingInitializedEvent.parameters = new Array()

  stakingInitializedEvent.parameters.push(
    new ethereum.EventParam("stakingToken", ethereum.Value.fromAddress(stakingToken))
  )
  stakingInitializedEvent.parameters.push(
    new ethereum.EventParam("initialRewardRate", ethereum.Value.fromUnsignedBigInt(initialRewardRate))
  )
  stakingInitializedEvent.parameters.push(
    new ethereum.EventParam("timestamp", ethereum.Value.fromUnsignedBigInt(timestamp))
  )

  return stakingInitializedEvent
}
