import { UintNumberType, ByteVectorType, ContainerType } from "@chainsafe/ssz";

// https://github.com/ethereum/consensus-specs/blob/dev/specs/phase0/beacon-chain.md#depositmessage
export const DepositMessage = new ContainerType({
  pubkey: new ByteVectorType(48),
  withdrawalCredentials: new ByteVectorType(32),
  amount: new UintNumberType(8)
});

// https://github.com/ethereum/consensus-specs/blob/dev/specs/phase0/beacon-chain.md#signingdata
export const SigningData = new ContainerType({
  objectRoot: new ByteVectorType(32),
  domain: new ByteVectorType(32)
});

// https://github.com/ethereum/consensus-specs/blob/dev/specs/phase0/beacon-chain.md#forkdata
export const ForkData = new ContainerType({
  currentVersion: new ByteVectorType(4),
  genesisValidatorsRoot: new ByteVectorType(32)
});
