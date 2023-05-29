import bls from "@chainsafe/bls/blst-native";
import {
  DepositMessage,
  SigningData,
  ForkData
} from "./ssz.js";

// Types: https://github.com/ethereum/consensus-specs/blob/dev/specs/phase0/beacon-chain.md#custom-types
const GENESIS_FORK_VERSION = Buffer.from("00000000", "hex");
const DOMAIN_DEPOSIT = Buffer.from("03000000", "hex");
const EMPTY_ROOT = Buffer.from("0000000000000000000000000000000000000000000000000000000000000000", "hex");

// convert hex strings from deposit-data.json to Deposit Message type
const makeDepositMessage = (pubkey, withdrawalCredentials, amount) => {
  const depositMessage = {
    pubkey: Buffer.from(pubkey, "hex"),
    withdrawalCredentials: Buffer.from(withdrawalCredentials, "hex"),
    amount: amount
  };
  return depositMessage;
} 

// https://github.com/ethereum/consensus-specs/blob/dev/specs/phase0/beacon-chain.md#compute_fork_data_root
const computeForkDataRoot = (currentVersion, genesisValidatorsRoot) => {
  const forkData = {
    currentVersion,
    genesisValidatorsRoot,
  };
  return ForkData.hashTreeRoot(forkData);
};

// https://github.com/ethereum/consensus-specs/blob/dev/specs/phase0/beacon-chain.md#compute_domain
const computeDomain = (
  domainType,
  forkVersion = GENESIS_FORK_VERSION,
  genesisValidatorsRoot = EMPTY_ROOT
) => {
  const forkDataRoot = computeForkDataRoot(forkVersion, genesisValidatorsRoot);
  const domain = new Uint8Array(32);
  domain.set(domainType);
  domain.set(forkDataRoot.subarray(0, 28), 4);
  return domain;
};

// https://github.com/ethereum/consensus-specs/blob/dev/specs/phase0/beacon-chain.md#compute_signing_root
const computeSigningRoot = (ssz_object, domain) => {
  const objectRoot = DepositMessage.hashTreeRoot(ssz_object)
  const signingData = {
    objectRoot,
    domain
  };
  return SigningData.hashTreeRoot(signingData);
}

// The JavaScript implementation of BLS verification in apply_deposit
// https://github.com/ethereum/consensus-specs/blob/dev/specs/phase0/beacon-chain.md#deposits
export const verifySignature = (pubkey, wc, amount, signature, forkVersion) => {
  const depositMessage = makeDepositMessage(pubkey, wc, amount);
  const domain = computeDomain(DOMAIN_DEPOSIT, Buffer.from(forkVersion, "hex"));
  const signingRoot = computeSigningRoot(depositMessage, domain);
  const pubkeyBytes = Uint8Array.from(Buffer.from(pubkey, 'hex'));
  const sigBytes = Uint8Array.from(Buffer.from(signature, 'hex'));
  return bls.verify(pubkeyBytes, signingRoot, sigBytes);
}

