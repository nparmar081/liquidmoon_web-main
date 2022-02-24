import { inject, provide, computed } from 'vue'
import { useAnchorWallet } from '@solana/wallet-adapter-vue'
import { Connection, PublicKey } from '@solana/web3.js'
import * as mplTokenMetadata from '@metaplex-foundation/mpl-token-metadata/'
import { Provider, Program } from '@project-serum/anchor'
import { useWallet } from "@solana/wallet-adapter-vue";
// const idl = {
// 	"metadata": {
// 		"address": 1
// 	}
// }
const idl = require('./solana_anchor.json');
const confirmOption =  {
  commitment : 'finalized',
  preflightCommitment : 'finalized',
  skipPreflight : false
}
const programID = new PublicKey(idl.metadata.address)
const workspaceSymbol = Symbol()

export const useWorkspace = () => inject(workspaceSymbol)

export const initWorkspace = () => {
  const anchorWallet = useAnchorWallet()
  const wallet = useWallet()
  const connection = new Connection("https://sparkling-dry-thunder.solana-devnet.quiknode.pro/08975c8cb3c5209785a819fc9a3b2b537d3ba604/")
  const provider = computed(() => new Provider(connection, wallet.value,confirmOption))
  const program = computed(() => new Program(idl, programID, provider))
  provide(workspaceSymbol, {
    wallet,
    connection,
    provider,
    program,
    mplTokenMetadata,
    anchorWallet,
    PublicKey,
    programID
  })
}
