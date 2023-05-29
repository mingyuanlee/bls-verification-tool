import {
  verifySignature
} from "./bls.js"

const test = () => {
  const pubkey = "84936d38629725cf9bad9119f64a59f4fb7a1c59d78e7fcb50195edbb124ae5752028c3daa1943df7937fca0cb087de1";
  const wc = "0100000000000000000000009c31086302ca285da106fe805487920fcb18278e"
  const amount = 32000000000
  const signature = "8c54429d6ee18444babb87acbc9fe320864e89af24cea1e1e0541137a0c8d4b2bf16899a82532cb8f3b5377b7d873e7b0fb3d3cd622f5f983637ba28c6e2187cafc227d3825ca9ae372d1644e51655bdb607177e97ac43410de1b884034e963a"
  const forkVersion = "00001020"
  const res = verifySignature(pubkey, wc, amount, signature, forkVersion)
  console.log("res", res)
}

test()