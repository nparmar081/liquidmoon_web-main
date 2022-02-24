/* eslint-disable no-unused-vars */
import { createStore } from "vuex"

import axios from "axios"

import { getSolanaExchangeRate } from "@/api/static"
import { login } from "@/api/user"
import { getAssetOwned, logout } from "@/api/collections.js"

import { useWorkspace } from "@/composables"
import { useAnchorWallet } from "@solana/wallet-adapter-vue"
import { watch } from "@vue/runtime-core"
import * as anchor from "@project-serum/anchor"
import {
  Keypair,
  PublicKey,
  Transaction,
  SYSVAR_CLOCK_PUBKEY,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
  TransactionInstruction,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js"
import {
  AccountLayout,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
} from "@solana/spl-token"
const POOL = new PublicKey(process.env.VUE_APP_POOL)
const ITEM_DATA_SIZE = process.env.VUE_APP_ITEM_DATA_SIZE
const TOKEN_METADATA_PROGRAM_ID = new PublicKey(
  process.env.VUE_APP_TOKEN_METADATA_PROGRAM_ID
)

export default createStore({
  state: {
    solana: {
      usd: 0,
      usd_24h_change: 0,
    },
    user: {
      wallet: null,
      walletBalance: 0,
      items: [],
      itemsLoaded: false,
      listedItems: [],
      listedItemsLoaded: false,
    },
    workspace: {
      program: null,
      connection: null,
      provider: null,
      mplTokenMetadata: null,
    },
  },
  mutations: {
    setSolanaExchangeRate(state, data) {
      state.solana.usd = data.data.price
      state.solana.usd_24h_change = data.data.priceChange
    },
    setUserWallet(state, data) {
      state.user.wallet = data
    },
    setWorkspace(state, data) {
      state.workspace.connection = data.connection
      state.workspace.mplTokenMetadata = data.mplTokenMetadata
      state.workspace.wallet = data.wallet
      state.workspace.program = data.program
      state.workspace.provider = data.provider
      state.workspace.programID = data.programID
      state.workspace.program.account.itemData._provider =
        state.workspace.provider
      state.workspace.program.account.pool._provider = state.workspace.provider
    },
    setUserWalletBalance(state, data) {
      state.user.walletBalance = data
    },
    clearUserItems(state) {
      state.user.items = []
    },
    setUserItemsLoading(state) {
      state.user.itemsLoaded = false
    },
    setUserItems(state, data) {
      state.user.items.push(data)
    },
    loadedUserItems(state) {
      state.user.itemsLoaded = true
    },
    setUserListedItemsLoading(state) {
      state.user.listedItemsLoaded = false
    },
    setUserListedItems(state, data) {
      state.user.listedItems = data
      state.user.listedItemsLoaded = true
    },
  },
  actions: {
    fetchExchangeRate({ commit }) {
      getSolanaExchangeRate().then((res) => {
        commit("setSolanaExchangeRate", res)
      })
    },
    loginWallet({ commit }, payload) {
      console.log("Login wallet")
      const {
        wallet,
        connection,
        mplTokenMetadata,
        program,
        provider,
        programID,
      } = useWorkspace()
      const anchorWallet = useAnchorWallet()
      commit("setWorkspace", {
        connection: connection,
        mplTokenMetadata: mplTokenMetadata,
        wallet: wallet,
        program: program,
        provider: provider,
        programID: programID,
        anchorWallet: anchorWallet,
      })

      watch(
        wallet.connecting,
        () => {
          if (wallet.connecting.value) {
            console.log("Wallet is connecting")
          }
        },
        { immediate: true }
      )

      watch(
        wallet.connected,
        () => {
          console.log("Wallet connected: " + wallet.connected.value)
          if (wallet.connected.value) {
            console.log("Wallet is connected")
            commit("setUserWallet", wallet)

            this.dispatch("loginUser")
            this.dispatch("getWalletBalance")
          } else {
            commit("setUserWallet", null)
            commit("clearUserItems")
            logout()
            localStorage.removeItem("token")
          
          }
        },
        { immediate: true }
      )
    },
    loginUser({ commit, state }) {
      console.log("Login user")
      const payload = {
        walletAddress: this.getters.walletPublicKey.toBase58(),
        walletName: state.user.wallet.wallet.name,
      }
      console.log(payload)
      login(payload).then((response) => {
        if (response.data) {
          localStorage.setItem("token", response.data.accessToken)
          this.dispatch("getWalletItems")
          this.dispatch("getAssetsOwned")
        }
      })
    },
    getWalletBalance({ commit, state }) {
      console.log("Getting wallet balance")
      if (state.user.wallet != null) {
        state.workspace.connection
          .getBalance(this.getters.walletPublicKey)
          .then((balance1) => {
            commit("setUserWalletBalance", balance1)
          })
      }
    },
    getWalletItems({ commit }) {
      console.log("Fetching user items")
      commit("setUserItemsLoading")
      if (
        this.state.workspace.mplTokenMetadata != null &&
        this.state.workspace.connection != null
      ) {
        this.state.workspace.mplTokenMetadata.Metadata.findByOwnerV2(
          this.state.workspace.connection,
          this.state.user.wallet.publicKey
        ).then((ownerResponse) => {
          commit("clearUserItems")
          if (ownerResponse.length > 0) {
            ownerResponse.forEach((response) => {
              const royalties =
                response.data.data.sellerFeeBasisPoints / 100 + "%"
              const nftCollection = {
                mintaddress: response.data.mint,
                sellerRoyalties: royalties,
                owner: this.getters.walletPublicKey.toBase58(),
              }
              axios
                .get(response.data.data.uri, {
                  headers: {
                    "Access-Control-Allow-Origin": "*",
                  },
                })
                .then((imageResponse) => {
                  if (imageResponse) {
                    nftCollection["name"] = imageResponse.data.name
                    nftCollection["image"] = imageResponse.data.image
                    nftCollection["description"] =
                      imageResponse.data.description
                    nftCollection["attributes"] = imageResponse.data.attributes
                    commit("setUserItems", nftCollection)
                    commit("loadedUserItems")

                    localStorage.setItem(
                      nftCollection.mintaddress,
                      JSON.stringify(nftCollection)
                    )
                  }
                })
            })
          } else {
            commit("loadedUserItems")
          }
        })
      }
    },

    getAssetsOwned({ commit }) {
      console.log("Getting assets owned")
      commit("setUserListedItemsLoading")
      getAssetOwned().then((response) => {
        commit("setUserListedItems", response.data.list)
      })
    },
    async listNft({ commit }, data) {
      const me = this
      const nftMint = new PublicKey(data.mintaddress)
      const itemData = Keypair.generate()
      let poolItemData = await this.state.workspace.program.account.pool.fetch(
        POOL
      )
      const sourceNftAccount = await this.dispatch("getTokenWallet", {
        publicKey: me.state.workspace.wallet.publicKey,
        mint: nftMint,
      })
      const destNftAccount = await this.dispatch("getTokenWallet", {
        publicKey: POOL,
        mint: nftMint,
      })
      let transaction = new Transaction()
      let signers = []
      signers.push(itemData)
      var accountInfo = null
      await me.state.workspace.connection
        .getAccountInfo(destNftAccount)
        .then((response) => {
          accountInfo = response
        })
      if (accountInfo == null) {
        transaction.add(
          await this.dispatch("createAssociatedTokenAccountInstruction", {
            associatedTokenAddress: destNftAccount,
            payer: me.state.workspace.wallet.publicKey,
            walletAddress: POOL,
            splTokenMintAddress: nftMint,
          })
        )
      }
      transaction.add(
        await me.state.workspace.program.instruction.listNft(
          new anchor.BN(poolItemData.bump),
          new anchor.BN(LAMPORTS_PER_SOL * data.price),
          {
            accounts: {
              owner: me.state.workspace.wallet.publicKey,
              pool: POOL,
              rand: poolItemData.rand,
              itemData: itemData.publicKey,
              nftMint: nftMint,
              sourceNftAccount: sourceNftAccount,
              destNftAccount: destNftAccount,
              tokenProgram: TOKEN_PROGRAM_ID,
              systemProgram: anchor.web3.SystemProgram.programId,
              clock: SYSVAR_CLOCK_PUBKEY,
            },
          }
        )
      )
      return await this.dispatch("sendTransaction", {
        transaction: transaction,
        signers: signers,
      })
    },
    async directBuy({ commit }, data) {
      var me = this
      const nftMint = new PublicKey(data.mintaddress)
      var nfts = await this.dispatch("getTokens", {
        owner: false,
        itemType: "nft",
      })
      var nftData = undefined
      nfts.forEach((nft) => {
        if (data.mintaddress == nft.address.toBase58()) {
          nftData = nft
        }
      })
      if (nftData) {
        const nftItemData = nftData.itemData
        let poolItemData =
          await this.state.workspace.program.account.pool.fetch(POOL)
        let listedNft =
          await this.state.workspace.program.account.itemData.fetch(nftItemData)
        const destNftAccount = await this.dispatch("getTokenWallet", {
          publicKey: me.state.workspace.wallet.publicKey,
          mint: nftMint,
        })
        let transaction = new Transaction()
        let signers = []
        if (
          (await me.state.workspace.connection.getAccountInfo(
            destNftAccount
          )) == null
        )
          transaction.add(
            await this.dispatch("createAssociatedTokenAccountInstruction", {
              associatedTokenAddress: destNftAccount,
              payer: me.state.workspace.wallet.publicKey,
              walletAddress: me.state.workspace.wallet.publicKey,
              splTokenMintAddress: nftMint,
            })
          )
        transaction.add(
          await me.state.workspace.program.instruction.directBuy(
            new anchor.BN(poolItemData.bump),
            {
              accounts: {
                owner: me.state.workspace.wallet.publicKey,
                seller: listedNft.owner,
                pool: POOL,
                rand: poolItemData.rand,
                marginWallet: poolItemData.marginWallet,
                nftItemData: nftItemData,
                sourceNftAccount: listedNft.account,
                destNftAccount: destNftAccount,
                tokenProgram: TOKEN_PROGRAM_ID,
                systemProgram: anchor.web3.SystemProgram.programId,
                clock: SYSVAR_CLOCK_PUBKEY,
              },
            }
          )
        )
        return await this.dispatch("sendTransaction", {
          transaction: transaction,
          signers: signers,
        })
      } else {
        return { err: { message: "data not found" } }
      }
    },
    async makeOffer({ commit }, data) {
      var me = this
      const nftMint = new PublicKey(data.mintaddress)
      const itemData = Keypair.generate()
      const sourceNftAccount = await this.dispatch("getTokenWallet", {
        publicKey: POOL,
        mint: nftMint,
      })
      let poolItemData = await this.state.workspace.program.account.pool.fetch(
        POOL
      )
      const destNftAccount = await this.dispatch("getTokenWallet", {
        publicKey: me.state.workspace.wallet.publicKey,
        mint: nftMint,
      })
      let transaction = new Transaction()
      let signers = []
      signers.push(itemData)
      var accountInfo = null
      await this.state.workspace.connection
        .getAccountInfo(destNftAccount)
        .then((response) => {
          accountInfo = response
        })
      if (accountInfo == null) {
        transaction.add(
          await this.dispatch("createAssociatedTokenAccountInstruction", {
            associatedTokenAddress: destNftAccount,
            payer: me.state.workspace.wallet.publicKey,
            walletAddress: me.state.workspace.wallet.publicKey,
            splTokenMintAddress: nftMint,
          })
        )
      }
      transaction.add(
        await me.state.workspace.program.instruction.listOffer(
          new anchor.BN(poolItemData.bump),
          new anchor.BN(poolItemData.vaultBump),
          new anchor.BN(LAMPORTS_PER_SOL * data.price),
          {
            accounts: {
              owner: me.state.workspace.wallet.publicKey,
              vaultWallet: poolItemData.vaultWallet,
              pool: POOL,
              rand: poolItemData.rand,
              vaultRand: poolItemData.vaultRand,
              itemData: itemData.publicKey,
              nftMint: nftMint,
              sourceNftAccount: sourceNftAccount,
              destNftAccount: destNftAccount,
              tokenProgram: TOKEN_PROGRAM_ID,
              systemProgram: anchor.web3.SystemProgram.programId,
              clock: SYSVAR_CLOCK_PUBKEY,
            },
          }
        )
      )
      return await this.dispatch("sendTransaction", {
        transaction: transaction,
        signers: signers,
      })
    },
    async getNftsForOwner({ commit }, payload) {
      var me = this
      const owner = this.state.workspace.wallet.publicKey
      let nftMint = new PublicKey(payload.assetId)
      const ownerTokenAccountInfo =
        await me.state.workspace.connection.getParsedTokenAccountsByOwner(
          owner,
          { programId: TOKEN_PROGRAM_ID }
        )
      var sourceAddress = ""
      ownerTokenAccountInfo.value.forEach((accountInfo) => {
        if (accountInfo.account.data.parsed.info.mint == nftMint.toBase58()) {
          sourceAddress = accountInfo.pubkey.toBase58()
        }
      })
      let [pda] = await PublicKey.findProgramAddress(
        [
          Buffer.from("metadata"),
          TOKEN_METADATA_PROGRAM_ID.toBuffer(),
          nftMint.toBuffer(),
        ],
        TOKEN_METADATA_PROGRAM_ID
      )
      const accountInfo =
        await me.state.workspace.connection.getParsedAccountInfo(pda)
      let metadata = new this.state.workspace.mplTokenMetadata.Metadata(
        owner.toString(),
        accountInfo.value
      )
      const { data } = await axios.get(metadata.data.data.uri)
      const entireData = {
        ...data,
        id: Number(data.name.replace(/^\D+/g, "").split(" - ")[0]),
      }
      const royalties = entireData.seller_fee_basis_points / 100 + "%"
      var result = {
        mintId: metadata.data.mint,
        owner: me.state.workspace.wallet.publicKey.toBase58(),
        sourceAddress: sourceAddress,
        name: entireData.name,
        imageUrl: entireData.image,
        listingPrice: 0,
        collection: {
          assetRoyalties: royalties,
          description: entireData.description,
        },
        assetTraitList: entireData.attributes ? entireData.attributes : [],
      }
      return result
    },
    async unlistNft({ commit }, data) {
      var me = this
      var assetOwned = {}
      if (this.state.user.listedItems) {
        this.state.user.listedItems.forEach((asset) => {
          if (asset.assetId == data.assetId) {
            assetOwned = asset
          }
        })
      }
      var nfts = await this.dispatch("getAllTokens")
      var nftData = undefined
      nfts.forEach((nft) => {
        if (assetOwned.chainTokenId == nft.address.toBase58()) {
          nftData = nft
        }
      })
      if (nftData) {
        let listedNft =
          await this.state.workspace.program.account.itemData.fetch(
            nftData.itemData
          )
        let poolItemData =
          await this.state.workspace.program.account.pool.fetch(POOL)
        let account = await this.state.workspace.connection.getAccountInfo(
          listedNft.account
        )
        let mint = new PublicKey(AccountLayout.decode(account.data).mint)
        const destNftAccount = await this.dispatch("getTokenWallet", {
          publicKey: me.state.workspace.wallet.publicKey,
          mint: mint,
        })
        let transaction = new Transaction()
        transaction.add(
          await me.state.workspace.program.instruction.unlistNft(
            new anchor.BN(poolItemData.bump),
            {
              accounts: {
                owner: me.state.workspace.wallet.publicKey,
                pool: POOL,
                rand: poolItemData.rand,
                itemData: nftData.itemData,
                sourceNftAccount: listedNft.account,
                destNftAccount: destNftAccount,
                tokenProgram: TOKEN_PROGRAM_ID,
                clock: SYSVAR_CLOCK_PUBKEY,
              },
            }
          )
        )
        return await this.dispatch("sendTransaction", {
          transaction: transaction,
          signers: [],
        })
      } else {
        return { err: { message: "data not found" } }
      }
    },
    async unlistOffer({ commit }, data) {
      var me = this
      let poolItemData = await this.state.workspace.program.account.pool.fetch(
        POOL
      )
      var nfts = await this.dispatch("getTokens", {
        owner: true,
        itemType: "offer",
      })
      var nftData = undefined
      nfts.forEach((nft) => {
        if (data.chainTokenId == nft.address.toBase58()) {
          nftData = nft
        }
      })
      if (nftData) {
        let transaction = new Transaction()
        transaction.add(
          await me.state.workspace.program.instruction.unlistOffer(
            new anchor.BN(poolItemData.bump),
            new anchor.BN(poolItemData.vaultBump),
            {
              accounts: {
                owner: me.state.workspace.wallet.publicKey,
                pool: POOL,
                rand: poolItemData.rand,
                vaultRand: poolItemData.vaultRand,
                vaultWallet: poolItemData.vaultWallet,
                itemData: nftData.itemData,
                systemProgram: anchor.web3.SystemProgram.programId,
                clock: SYSVAR_CLOCK_PUBKEY,
              },
            }
          )
        )
        return await this.dispatch("sendTransaction", {
          transaction: transaction,
          signers: [],
        })
      } else {
        return { err: { message: "data not found" } }
      }
    },
    async acceptOffer({ commit }, data) {
      var me = this
      var nfts = await this.dispatch("getAllTokens")
      var nftData = undefined
      nfts.forEach((nft) => {
        if (data.chainTokenId == nft.address.toBase58()) {
          nftData = nft
        }
      })
      if (nftData) {
        let listedNft =
          await this.state.workspace.program.account.itemData.fetch(
            nftData.itemData
          )
        let listedOffer =
          await this.state.workspace.program.account.itemData.fetch(
            nftData.offerData
          )
        let poolItemData =
          await this.state.workspace.program.account.pool.fetch(POOL)
        let transaction = new Transaction()
        transaction.add(
          await this.state.workspace.program.instruction.acceptOffer(
            new anchor.BN(poolItemData.bump),
            new anchor.BN(poolItemData.vaultBump),
            {
              accounts: {
                owner: me.state.workspace.wallet.publicKey,
                pool: POOL,
                rand: poolItemData.rand,
                vaultRand: poolItemData.vaultRand,
                buyer: listedOffer.owner,
                vaultWallet: poolItemData.vaultWallet,
                marginWallet: poolItemData.marginWallet,
                nftItemData: nftData.itemData,
                offerItemData: nftData.offerData,
                sourceNftAccount: listedNft.account,
                destNftAccount: listedOffer.account,
                tokenProgram: TOKEN_PROGRAM_ID,
                systemProgram: anchor.web3.SystemProgram.programId,
                clock: SYSVAR_CLOCK_PUBKEY,
              },
            }
          )
        )
        return await this.dispatch("sendTransaction", {
          transaction: transaction,
          signers: [],
        })
      } else {
        return { err: { message: "data not found" } }
      }
    },
    async sendTransaction({ commit }, data) {
      console.log("Send transaction")
      var result = {}
      try {
        var me = this
        data.transaction.feePayer = this.state.workspace.wallet.publicKey
        await this.state.workspace.connection
          .getRecentBlockhash("max")
          .then((response) => {
            data.transaction.recentBlockhash = response.blockhash
          })
        await data.transaction.setSigners(
          me.state.workspace.wallet.publicKey,
          ...data.signers.map((s) => s.publicKey)
        )
        if (data.signers.length != 0)
          await data.transaction.partialSign(...data.signers)
        var signedTransaction = null
        await me.state.workspace.wallet
          .signTransaction(data.transaction)
          .then((response) => {
            signedTransaction = response
          })
        let hash = await me.state.workspace.connection.sendRawTransaction(
          await signedTransaction.serialize()
        )
        await me.state.workspace.connection.confirmTransaction(hash)
        result["hash"] = hash
        return result
      } catch (err) {
        console.log(err)
        result["err"] = err
        return result
      }
    },
    async getTokenWallet({ commit }, data) {
      var tokenWallet = undefined
      await PublicKey.findProgramAddress(
        [
          data.publicKey.toBuffer(),
          TOKEN_PROGRAM_ID.toBuffer(),
          data.mint.toBuffer(),
        ],
        ASSOCIATED_TOKEN_PROGRAM_ID
      ).then((response) => {
        tokenWallet = response[0]
      })
      return tokenWallet
    },
    createAssociatedTokenAccountInstruction({ commit }, data) {
      const keys = [
        { pubkey: data.payer, isSigner: true, isWritable: true },
        {
          pubkey: data.associatedTokenAddress,
          isSigner: false,
          isWritable: true,
        },
        { pubkey: data.walletAddress, isSigner: false, isWritable: false },
        {
          pubkey: data.splTokenMintAddress,
          isSigner: false,
          isWritable: false,
        },
        {
          pubkey: SystemProgram.programId,
          isSigner: false,
          isWritable: false,
        },
        { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
        {
          pubkey: SYSVAR_RENT_PUBKEY,
          isSigner: false,
          isWritable: false,
        },
      ]
      return new TransactionInstruction({
        keys,
        programId: ASSOCIATED_TOKEN_PROGRAM_ID,
        data: Buffer.from([]),
      })
    },
    async getAllTokens({ commit }, data) {
      var allListedOffers = await this.dispatch("getTokens", {
        owner: false,
        itemType: "offer",
        fetchAll: true,
      })
      return await this.dispatch("getTokens", {
        owner: true,
        itemType: "nft",
        allListedOffers: allListedOffers,
      })
    },
    async getTokens({ commit }, data) {
      var me = this
      var dataOwner = data.owner ? data.owner : false
      var type = data.itemType ? data.itemType : "nft"
      var allListedOffers = data.allListedOffers ? data.allListedOffers : []
      var fetchAll = data.fetchAll ? data.fetchAll : false
      var owner = me.state.workspace.wallet.publicKey
      const allTokens = []
      const filters = [{ memcmp: { offset: 41, bytes: POOL.toBase58() } }]
      if (dataOwner) {
        filters.push({ memcmp: { offset: 9, bytes: owner.toBase58() } })
      }
      let resp = await me.state.workspace.connection.getProgramAccounts(
        me.state.workspace.programID,
        {
          dataSlice: { length: 0, offset: 0 },
          filters: filters,
        }
      )
      for (let nftAccount of resp) {
        let listed = await me.state.workspace.program.account.itemData.fetch(
          nftAccount.pubkey
        )
        if (listed.unlisted) continue
        if (type == "nft" && listed.itemType != 0) continue
        if (type == "offer" && listed.itemType != 1) continue
        if (fetchAll && listed.owner == owner.toString()) continue
        let account = await me.state.workspace.connection.getAccountInfo(
          listed.account
        )
        let mint = new PublicKey(AccountLayout.decode(account.data).mint)
        let pda = await this.dispatch("getMetadata", mint)
        const accountInfo =
          await me.state.workspace.connection.getParsedAccountInfo(pda)
        let metadata = new me.state.workspace.mplTokenMetadata.Metadata(
          POOL.toString(),
          accountInfo.value
        )
        const { data } = await axios.get(metadata.data.data.uri)
        const entireData = {
          ...data,
          id: Number(data.name.replace(/^\D+/g, "").split(" - ")[0]),
        }
        entireData.itemAmount = listed.itemAmount.toNumber()
        entireData.createdTime = listed.createdTime.toNumber()
        entireData.itemData = nftAccount.pubkey
        entireData.address = mint
        if (allListedOffers.length > 0) {
          let offerPrice = 0
          for (let listedOffer of allListedOffers) {
            if (listedOffer.address.toString() == mint.toString()) {
              if (listedOffer.itemAmount > offerPrice) {
                offerPrice = listedOffer.itemAmount
                entireData.offerData = listedOffer.itemData
                entireData.offerPrice = offerPrice
              }
            }
          }
        }
        allTokens.push(entireData)
      }
      return allTokens
    },
    async getMetadata({ commit }, mint) {
      var metadata = undefined
      await PublicKey.findProgramAddress(
        [
          Buffer.from("metadata"),
          TOKEN_METADATA_PROGRAM_ID.toBuffer(),
          mint.toBuffer(),
        ],
        TOKEN_METADATA_PROGRAM_ID
      ).then((response) => {
        metadata = response[0]
      })
      return metadata
    },
  },
  modules: {},
  getters: {
    solanaPrice: (state) => state.solana.usd,
    solana24hChange: (state) => state.solana.usd_24h_change.toFixed(2),
    program: (state) => {
      return state.workspace.program
    },
    connection: (state) => {
      return state.workspace.connection
    },
    provider: (state) => {
      return state.workspace.provider
    },
    mplTokenMetadata: (state) => {
      return state.workspace.mplTokenMetadata
    },
    isWalletConnected: (state) => {
      if (state.user.wallet) {
        return state.user.wallet.connected
      }
      return false
    },
    wallet: (state) => {
      return state.user.wallet
    },
    walletPublicKey: (state) => {
      if (state.user.wallet) {
        if (state.user.wallet.publicKey) {
          return state.user.wallet.publicKey
        }
      }
      return null
    },
    userItemsLoaded: (state) => {
      return state.user.itemsLoaded
    },
    userListedItemsLoaded: (state) => {
      return state.user.listedItemsLoaded
    },
    getListedItems: (state) => {
      return state.user.listedItems
    },
  },
})
