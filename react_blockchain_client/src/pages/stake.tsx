import { useState, useEffect } from 'react';
import useNotify from './notify'
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import * as anchor from "@project-serum/anchor";
import {AccountLayout, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID} from "@solana/spl-token";
import { programs } from '@metaplex/js'
import {
  Connection,
  Keypair,
  PublicKey,
  Transaction,
  ConfirmOptions,
  LAMPORTS_PER_SOL,
  SYSVAR_CLOCK_PUBKEY,
} from "@solana/web3.js";
import axios from "axios"
import './work.css';

const { metadata: { Metadata } } = programs;

const TOKEN_METADATA_PROGRAM_ID = new anchor.web3.PublicKey(
  "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
);

const confirmOption : ConfirmOptions = {
  commitment : 'finalized',
  preflightCommitment : 'finalized',
  skipPreflight : false
}

let conn = new anchor.web3.Connection("https://sparkling-dry-thunder.solana-devnet.quiknode.pro/08975c8cb3c5209785a819fc9a3b2b537d3ba604/");
const programId = new PublicKey('3oCfrjNptu3u16yhGVRSM6hKbBhZCF5fMVLEcNSEMQB1');
const vaultKeypair = "[110,40,84,113,98,26,196,13,1,103,9,198,255,237,225,22,27,252,135,144,246,108,174,134,229,11,217,120,220,131,139,71,190,118,60,174,56,152,125,249,122,210,29,177,64,83,18,137,212,193,172,202,147,244,8,69,151,110,90,70,51,101,79,61]";
const idl = require('./solana_anchor.json');
const ITEM_DATA_SIZE = 8 + 1 + 32 + 32 + 32 + 8 + 1 + 8;

export default function Stake() {
	const wallet = useAnchorWallet();
	const notify = useNotify();
  const [POOL, setPOOL] = useState<PublicKey>(new PublicKey('GTrV8irqRNFSwzoFGJzCaZB3d1EdfuFJuHc6dYeVTySM'));
  const [withdrawtype, setWithdrawtype] = useState(0);
  const [withdrawable, setWithdrawable] = useState(7);
  const [isWorking, setIsWorking] = useState(false);
  const [pD, setPD] = useState({
    owner: "",
    rand: "",
    withdrawtype: 0,
    withdrawable: 7,
    bump: ""
  });
  const [nfts, setNfts] = useState<Array<any>>([]);
  const [allListedOffers, setAllListedOffers] = useState<Array<any>>([]);
  const [listedOffers, setListedOffers] = useState<Array<any>>([]);
  const [allListedNfts, setAllListedNfts] = useState<Array<any>>([]);
  const [listedNfts, setListedNfts] = useState<Array<any>>([]);

  const createAssociatedTokenAccountInstruction = (
    associatedTokenAddress: anchor.web3.PublicKey,
    payer: anchor.web3.PublicKey,
    walletAddress: anchor.web3.PublicKey,
    splTokenMintAddress: anchor.web3.PublicKey
      ) => {
    const keys = [
      { pubkey: payer, isSigner: true, isWritable: true },
      { pubkey: associatedTokenAddress, isSigner: false, isWritable: true },
      { pubkey: walletAddress, isSigner: false, isWritable: false },
      { pubkey: splTokenMintAddress, isSigner: false, isWritable: false },
      {
        pubkey: anchor.web3.SystemProgram.programId,
        isSigner: false,
        isWritable: false,
      },
      { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
      {
        pubkey: anchor.web3.SYSVAR_RENT_PUBKEY,
        isSigner: false,
        isWritable: false,
      },
    ];
    return new anchor.web3.TransactionInstruction({
      keys,
      programId: ASSOCIATED_TOKEN_PROGRAM_ID,
      data: Buffer.from([]),
    });
  }
  
  const getMasterEdition = async (
    mint: anchor.web3.PublicKey
      ): Promise<anchor.web3.PublicKey> => {
    return (
      await anchor.web3.PublicKey.findProgramAddress(
        [
          Buffer.from("metadata"),
          TOKEN_METADATA_PROGRAM_ID.toBuffer(),
          mint.toBuffer(),
          Buffer.from("edition"),
        ],
        TOKEN_METADATA_PROGRAM_ID
      )
    )[0];
  };
  
  const getMetadata = async (
    mint: anchor.web3.PublicKey
      ): Promise<anchor.web3.PublicKey> => {
    return (
      await anchor.web3.PublicKey.findProgramAddress(
        [
          Buffer.from("metadata"),
          TOKEN_METADATA_PROGRAM_ID.toBuffer(),
          mint.toBuffer(),
        ],
        TOKEN_METADATA_PROGRAM_ID
      )
    )[0];
  };
  
  const getTokenWallet = async (
    wallet: anchor.web3.PublicKey,
    mint: anchor.web3.PublicKey
      ) => {
    return (
      await anchor.web3.PublicKey.findProgramAddress(
        [wallet.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), mint.toBuffer()],
        ASSOCIATED_TOKEN_PROGRAM_ID
      )
    )[0];
  };
  
  async function sendTransaction(transaction : Transaction, signers : Keypair[]) {
    try{
      // @ts-ignore
      transaction.feePayer = wallet.publicKey
      transaction.recentBlockhash = (await conn.getRecentBlockhash('max')).blockhash;
      // @ts-ignore
      await transaction.setSigners(wallet.publicKey,...signers.map(s => s.publicKey));
      if(signers.length != 0)
        await transaction.partialSign(...signers);
        // @ts-ignore
      const signedTransaction = await wallet.signTransaction(transaction);
      let hash = await conn.sendRawTransaction(await signedTransaction.serialize());
      await conn.confirmTransaction(hash);
      notify('success', 'Success!');
      await getNfts();
      return true;
    } catch(err) {
      console.log(err)
      notify('error', 'Failed Instruction!');
      return false;
    }
  }
  
  async function initPool(withdrawtype : number, withdrawable : number) {
    let provider = new anchor.Provider(conn, wallet as any, confirmOption);
    let program = new anchor.Program(idl, programId, provider);
    let randomPubkey = Keypair.generate().publicKey;
    let [pool,bump] = await PublicKey.findProgramAddress([randomPubkey.toBuffer()], programId);
    let transaction = new Transaction()
    let signers : Keypair[] = [];
    transaction.add(
      await program.instruction.initPool(
        new anchor.BN(bump),
        new anchor.BN(withdrawtype),
        new anchor.BN(withdrawable),
        {
          accounts:{
            // @ts-ignore
            owner : wallet.publicKey,
            pool : pool,
            rand : randomPubkey,
            systemProgram : anchor.web3.SystemProgram.programId,
          }
        }
      )
    );
    await sendTransaction(transaction, []);
    return pool
  }
  
  async function listNft(nftMint : PublicKey) {
    let provider = new anchor.Provider(conn, wallet as any, confirmOption);
    let program = new anchor.Program(idl,programId,provider);
    const itemData = Keypair.generate();
    const metadata = await getMetadata(nftMint);
    // @ts-ignore
    const sourceNftAccount = await getTokenWallet(wallet.publicKey, nftMint);
    const destNftAccount = await getTokenWallet(POOL, nftMint);
    let transaction = new Transaction();
    let signers : Keypair[] = [];
    signers.push(itemData);
  
    if((await conn.getAccountInfo(destNftAccount)) == null)
      // @ts-ignore
      transaction.add(createAssociatedTokenAccountInstruction(destNftAccount, wallet.publicKey, POOL, nftMint));
    transaction.add(
      await program.instruction.listNft({
        accounts: {
          // @ts-ignore
          owner : wallet.publicKey,
          pool : POOL,
          itemData : itemData.publicKey,
          nftMint : nftMint,
          metadata : metadata,
          sourceNftAccount : sourceNftAccount,
          destNftAccount : destNftAccount,
          tokenProgram : TOKEN_PROGRAM_ID,
          systemProgram : anchor.web3.SystemProgram.programId,
          clock : SYSVAR_CLOCK_PUBKEY
        }
      })
    )
    await sendTransaction(transaction,signers)
  }
  
  async function listOffer(nftMint : PublicKey, price: number) {
    let provider = new anchor.Provider(conn, wallet as any, confirmOption);
    let program = new anchor.Program(idl,programId,provider);
    const walletKeypair = loadWalletKey();
    const itemData = Keypair.generate();
    const metadata = await getMetadata(nftMint);
    const sourceNftAccount = await getTokenWallet(POOL, nftMint);
    // @ts-ignore
    const destNftAccount = await getTokenWallet(wallet.publicKey, nftMint);
    let transaction = new Transaction();
    let signers : Keypair[] = [];
    signers.push(itemData);
  
    if((await conn.getAccountInfo(destNftAccount)) == null)
      // @ts-ignore
      transaction.add(createAssociatedTokenAccountInstruction(destNftAccount, wallet.publicKey, wallet.publicKey, nftMint));
    
    transaction.add(
      await program.instruction.listOffer(
        new anchor.BN(LAMPORTS_PER_SOL * price),
        {
          accounts: {
            // @ts-ignore
            owner : wallet.publicKey,
            gainer : walletKeypair.publicKey,
            pool : POOL,
            itemData : itemData.publicKey,
            nftMint : nftMint,
            metadata : metadata,
            sourceNftAccount : sourceNftAccount,
            destNftAccount : destNftAccount,
            tokenProgram : TOKEN_PROGRAM_ID,
            systemProgram : anchor.web3.SystemProgram.programId,
            clock : SYSVAR_CLOCK_PUBKEY
        }
      })
    );
    await sendTransaction(transaction,signers);
  }
  
  async function unlistNft(itemData : PublicKey) {
    let provider = new anchor.Provider(conn, wallet as any, confirmOption);
    let program = new anchor.Program(idl,programId,provider);
    let listedNft = await program.account.itemData.fetch(itemData);
    let account = await conn.getAccountInfo(listedNft.account);
    let mint = new PublicKey(AccountLayout.decode(account!.data).mint);
    // @ts-ignore
    const destNftAccount = await getTokenWallet(wallet.publicKey,mint);
    let transaction = new Transaction();
  
    transaction.add(
      await program.instruction.unlistNft({
        accounts:{
          // @ts-ignore
          owner : wallet.publicKey,
          pool : POOL,
          itemData : itemData,
          sourceNftAccount : listedNft.account,
          destNftAccount : destNftAccount,
          tokenProgram : TOKEN_PROGRAM_ID,
          clock : SYSVAR_CLOCK_PUBKEY
        }
      })
    );
    await sendTransaction(transaction,[]);
  }
  
  async function unlistOffer(itemData : PublicKey, offerPrice: number) {
    let provider = new anchor.Provider(conn, wallet as any, confirmOption);
    let program = new anchor.Program(idl,programId,provider);
    let transaction = new Transaction();
  
    transaction.add(
      await program.instruction.unlistOffer({
        accounts:{
          // @ts-ignore
          owner : wallet.publicKey,
          pool : POOL,
          itemData : itemData,
          systemProgram : anchor.web3.SystemProgram.programId,
          clock : SYSVAR_CLOCK_PUBKEY
        }
      })
    );
    const result = await sendTransaction(transaction,[]);
    if (result) {
      // @ts-ignore
      await paySeller(wallet.publicKey, offerPrice);
    }
  }
  
  async function acceptOffer(nftItemData : PublicKey, offerItemData: PublicKey, offerPrice: number) {
    let provider = new anchor.Provider(conn, wallet as any, confirmOption);
    let program = new anchor.Program(idl,programId,provider);
    let listedNft = await program.account.itemData.fetch(nftItemData);
    let listedOffer = await program.account.itemData.fetch(offerItemData);
    let transaction = new Transaction();
  
    transaction.add(
      await program.instruction.acceptOffer({
        accounts:{
          // @ts-ignore
          owner : wallet.publicKey,
          pool : POOL,
          nftItemData : nftItemData,
          offerItemData : offerItemData,
          sourceNftAccount : listedNft.account,
          destNftAccount : listedOffer.account,
          tokenProgram : TOKEN_PROGRAM_ID,
          systemProgram : anchor.web3.SystemProgram.programId,
          clock : SYSVAR_CLOCK_PUBKEY
        }
      })
    );
    const result = await sendTransaction(transaction,[]);
    if (result) {
      // @ts-ignore
      await paySeller(wallet.publicKey, offerPrice);
    }
  }

  function loadWalletKey(): Keypair {
    const loaded = Keypair.fromSecretKey(
      new Uint8Array(JSON.parse(vaultKeypair)),
    );
    return loaded;
  }

  async function paySeller(seller: PublicKey, offerPrice: number) {
    const walletKeypair = loadWalletKey();
    const walletWrapper = new anchor.Wallet(walletKeypair);
    let provider = new anchor.Provider(conn, walletWrapper, confirmOption);
    let program = new anchor.Program(idl, programId, provider);
    let transaction = new Transaction();
    let signers : Keypair[] = [];
    signers.push(walletKeypair);

    transaction.add(
      await program.instruction.paySeller(
        new anchor.BN(offerPrice),
        {
          accounts:{
            wallet : walletKeypair.publicKey,
            gainer : seller,
            systemProgram : anchor.web3.SystemProgram.programId,
        }
      })
    );
    await sendTransaction(transaction, signers);
  }
  
  async function getNftsForOwner(conn : any, owner : PublicKey){
    const allTokens: any = []
    const tokenAccounts = await conn.getParsedTokenAccountsByOwner(owner, {
      programId: TOKEN_PROGRAM_ID
    });
  
    for (let index = 0; index < tokenAccounts.value.length; index++) {
      try{
        const tokenAccount = tokenAccounts.value[index];
        const tokenAmount = tokenAccount.account.data.parsed.info.tokenAmount;
  
        if (tokenAmount.amount == "1" && tokenAmount.decimals == "0") {
          let nftMint = new PublicKey(tokenAccount.account.data.parsed.info.mint)
          let [pda] = await anchor.web3.PublicKey.findProgramAddress([
            Buffer.from("metadata"),
            TOKEN_METADATA_PROGRAM_ID.toBuffer(),
            nftMint.toBuffer(),
          ], TOKEN_METADATA_PROGRAM_ID);
          const accountInfo: any = await conn.getParsedAccountInfo(pda);
          let metadata : any = new Metadata(owner.toString(), accountInfo.value);
          const { data }: any = await axios.get(metadata.data.data.uri)
          const entireData = { ...data, id: Number(data.name.replace( /^\D+/g, '').split(' - ')[0]) }
          allTokens.push({address : nftMint, ...entireData })
        }
        allTokens.sort(function (a: any, b: any) {
          if (a.name < b.name) { return -1; }
          if (a.name > b.name) { return 1; }
          return 0;
        })
      } catch(err) {
        continue;
      }
    }
    return allTokens;
  }
  
  async function getListedNftsForOwner(conn : Connection, owner : PublicKey, allListedOffers: Array<any>){
    const wallet = new anchor.Wallet(Keypair.generate());
    const provider = new anchor.Provider(conn, wallet, anchor.Provider.defaultOptions());
    const program = new anchor.Program(idl, programId, provider);
    const allTokens: any = []
    let resp = await conn.getProgramAccounts(programId,{
      dataSlice: {length: 0, offset: 0},
      filters: [{dataSize: ITEM_DATA_SIZE},{memcmp:{offset:9,bytes:owner.toBase58()}},{memcmp:{offset:41,bytes:POOL.toBase58()}}]
    })
    for(let nftAccount of resp) {
      let listed = await program.account.itemData.fetch(nftAccount.pubkey)
      if (listed.unlisted) continue;
      if (listed.itemType != 0) continue;
      let account = await conn.getAccountInfo(listed.account)
      let mint = new PublicKey(AccountLayout.decode(account!.data).mint)
      let pda= await getMetadata(mint)
      const accountInfo: any = await conn.getParsedAccountInfo(pda);
      let metadata : any = new Metadata(owner.toString(), accountInfo.value);
      const { data }: any = await axios.get(metadata.data.data.uri)
      const entireData = { ...data, id: Number(data.name.replace( /^\D+/g, '').split(' - ')[0])}
      entireData.createdTime = listed.createdTime.toNumber();
      entireData.itemData = nftAccount.pubkey;
      entireData.itemAmount = listed.itemAmount.toNumber();
      entireData.address = mint;
      entireData.offerData = null;
      let offerPrice = 0;
      for (let listedOffer of allListedOffers) {
        if (listedOffer.address.toString() == mint.toString()) {
          if (listedOffer.itemAmount > offerPrice) {
            offerPrice = listedOffer.itemAmount;
            entireData.offerData = listedOffer.itemData;
            entireData.offerPrice = offerPrice;
          }
        }
      }
      allTokens.push(entireData);
    }
    return allTokens
  }
  
  async function getListedOffersForOwner(conn : Connection, owner : PublicKey){
    const wallet = new anchor.Wallet(Keypair.generate());
    const provider = new anchor.Provider(conn, wallet, anchor.Provider.defaultOptions());
    const program = new anchor.Program(idl, programId, provider);
    const allTokens: any = []
    let resp = await conn.getProgramAccounts(programId,{
      dataSlice: {length: 0, offset: 0},
      filters: [{dataSize: ITEM_DATA_SIZE},{memcmp:{offset:9,bytes:owner.toBase58()}},{memcmp:{offset:41,bytes:POOL.toBase58()}}]
    })
    for(let nftAccount of resp) {
      let listed = await program.account.itemData.fetch(nftAccount.pubkey)
      if (listed.unlisted) continue;
      if (listed.itemType != 1) continue;
      let account = await conn.getAccountInfo(listed.account)
      let mint = new PublicKey(AccountLayout.decode(account!.data).mint)
      let pda= await getMetadata(mint)
      const accountInfo: any = await conn.getParsedAccountInfo(pda);
      let metadata : any = new Metadata(owner.toString(), accountInfo.value);
      const { data }: any = await axios.get(metadata.data.data.uri)
      const entireData = { ...data, id: Number(data.name.replace( /^\D+/g, '').split(' - ')[0])}
      entireData.itemAmount = listed.itemAmount.toNumber();
      allTokens.push({
        createdTime : listed.createdTime.toNumber(),
        itemData : nftAccount.pubkey,
        address : mint,
        ...entireData,
      })
    }
    return allTokens
  }
  
  async function getAllListedNFTs(conn : Connection, owner : PublicKey, listedOffers: Array<any>){
    const wallet = new anchor.Wallet(Keypair.generate());
    const provider = new anchor.Provider(conn, wallet, anchor.Provider.defaultOptions());
    const program = new anchor.Program(idl, programId, provider);
    const allTokens: any = [];
    let resp = await conn.getProgramAccounts(programId,{
      dataSlice: {length: 0, offset: 0},
      filters: [{dataSize: ITEM_DATA_SIZE},{memcmp:{offset:41,bytes:POOL.toBase58()}}]
    })
    for(let nftAccount of resp) {
      let listed = await program.account.itemData.fetch(nftAccount.pubkey)
      if (listed.unlisted) continue;
      if (listed.itemType != 0) continue;
      if (listed.owner == owner.toString()) continue;
      let account = await conn.getAccountInfo(listed.account)
      let mint = new PublicKey(AccountLayout.decode(account!.data).mint)
      let pda= await getMetadata(mint)
      const accountInfo: any = await conn.getParsedAccountInfo(pda);
      let metadata : any = new Metadata(POOL.toString(), accountInfo.value);
      const { data }: any = await axios.get(metadata.data.data.uri)
      const entireData = { ...data, id: Number(data.name.replace( /^\D+/g, '').split(' - ')[0])}
      entireData.itemAmount = listed.itemAmount.toNumber();
      entireData.createdTime = listed.createdTime.toNumber();
      entireData.itemData = nftAccount.pubkey;
      entireData.address = mint;
      let existed = false;
      for (let listedOffer of listedOffers) {
        if (listedOffer.address.toString() == mint.toString()) {
          existed = true;
        }
      }
      if (!existed)
        allTokens.push(entireData);
    }
    return allTokens
  }
  
  async function getAllListedOffers(conn : Connection, owner: PublicKey) {
    const wallet = new anchor.Wallet(Keypair.generate());
    const provider = new anchor.Provider(conn, wallet, anchor.Provider.defaultOptions());
    const program = new anchor.Program(idl, programId, provider);
    const allTokens: any = []
    let resp = await conn.getProgramAccounts(programId,{
      dataSlice: {length: 0, offset: 0},
      filters: [{dataSize: ITEM_DATA_SIZE},{memcmp:{offset:41,bytes:POOL.toBase58()}}]
    })
    for(let nftAccount of resp) {
      let listed = await program.account.itemData.fetch(nftAccount.pubkey)
      if (listed.unlisted) continue;
      if (listed.itemType != 1) continue;
      if (listed.owner == owner.toString()) continue;
      let account = await conn.getAccountInfo(listed.account)
      let mint = new PublicKey(AccountLayout.decode(account!.data).mint)
      let pda= await getMetadata(mint)
      const accountInfo: any = await conn.getParsedAccountInfo(pda);
      let metadata : any = new Metadata(POOL.toString(), accountInfo.value);
      const { data }: any = await axios.get(metadata.data.data.uri)
      const entireData = { ...data, id: Number(data.name.replace( /^\D+/g, '').split(' - ')[0])}
      entireData.itemAmount = listed.itemAmount.toNumber();
      allTokens.push({
        createdTime : listed.createdTime.toNumber(),
        itemData : nftAccount.pubkey,
        address : mint,
        ...entireData,
      })
    }
    return allTokens
  }
  
  async function getPoolData() {
    let wallet = new anchor.Wallet(Keypair.generate());
    let provider = new anchor.Provider(conn, wallet, confirmOption);
    const program = new anchor.Program(idl, programId, provider);
    let poolData = await program.account.pool.fetch(POOL);
    setPD({
      owner : poolData.owner.toBase58(),
      rand : poolData.rand.toBase58(),
      withdrawtype : poolData.withdrawtype,
      withdrawable : poolData.withdrawable,
      bump : poolData.bump
    });
  }
  
  async function getNfts() {
    await getPoolData();
    // @ts-ignore
    const nfts = await getNftsForOwner(conn, wallet.publicKey);
    setNfts(nfts);
    // @ts-ignore
    const allListedOffers = await getAllListedOffers(conn, wallet.publicKey);
    setAllListedOffers(allListedOffers);
    // @ts-ignore
    const listedOffers = await getListedOffersForOwner(conn, wallet.publicKey);
    setListedOffers(listedOffers);
    // @ts-ignore
    const allListedNfts = await getAllListedNFTs(conn, wallet.publicKey, listedOffers);
    setAllListedNfts(allListedNfts);
    // @ts-ignore
    const listedNfts = await getListedNftsForOwner(conn, wallet.publicKey, allListedOffers);
    setListedNfts(listedNfts);
  }

	useEffect(() => {
    (async () => {
      if (wallet && wallet.publicKey) {
        setIsWorking(true);
        await getNfts();
        setIsWorking(false);
      }
    })();
  }, [wallet]);

	return <div className="mother-container">
    {wallet ?
    <div className="container-fluid mt-4">
      <div className="row mb-3">
        <div className="col-lg-6">
          <div className="input-group">
            <div className="input-group-prepend">
              <span className="input-group-text">Withdraw Type (0: Immediate 1: Periodic)</span>
            </div>
            <input name="period"  type="number" className="form-control" onChange={(event)=>{setWithdrawtype(Number(event.target.value))}} value={withdrawtype}/>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="input-group">
            <div className="input-group-prepend">
              <span className="input-group-text">Withdrawable Days</span>
            </div>
            <input name="withdrawable"  type="number" className="form-control" onChange={(event)=>{setWithdrawable(Number(event.target.value))}} value={withdrawable}/>
          </div>
        </div>
      </div>

      <div className="row mb-3">
        <div className="col-lg-6">
          <button type="button" className="btn btn-warning m-1" onClick={async () =>{
            setIsWorking(true);
            const POOL = await initPool(withdrawtype, withdrawable);
            setPOOL(POOL);
            setIsWorking(false);
          }}>Create Auction Pool</button>
          <button type="button" className="btn btn-warning m-1" onClick={async () =>{
            setIsWorking(true);
            await getPoolData();
            setIsWorking(false);
          }}>Get Pool Data</button>
        </div>
        <div className="col-lg-6">
          {POOL ? POOL.toBase58() : ""}
        </div>
      </div>

      <hr/>

      <div className="row">
        {
          pD &&
          <div className="w-full">
            <h4>Pool Data</h4>
            <h5>{"Owner : "+pD.owner}</h5>
            <h5>{"Rand : "+pD.rand}</h5>
            <h5>{"Withdrawtype : "+pD.withdrawtype!}</h5>
            <h5>{"Withdrawable Days: "+pD.withdrawable}</h5>
          </div>
        }
      </div>

      <hr/>

      <div className="row">
        <div className="col-lg-4">
          <h4>Your Wallet NFTs</h4>
          <div className="row">
          {
            nfts.map((nft: any,idx)=>{
              return <div className="card m-3" key={idx} style={{"width" : "250px"}}>
                <img className="card-img-top" src={nft.image} alt="Image Error"/>
                <div className="card-img-overlay">
                  <h4>{nft.name}</h4>
                  <button type="button" className="btn btn-success" onClick={async ()=>{
                    setIsWorking(true);
                    await listNft(nft.address);
                    setIsWorking(false);
                  }}>List</button>
                </div>
              </div>
            })
          }
          </div>
        </div>
        <div className="col-lg-4">
          <h4>Your Listed NFTs</h4>
          <div className="row">
          {
            listedNfts.map((nft: any,idx)=>{
              return <div className="card m-3" key={idx} style={{"width" : "250px"}}>
                <img className="card-img-top" src={nft.image} alt="Image Error"/>
                <div className="card-img-overlay">
                  <h4>{nft.name}</h4>
                  <button type="button" className="btn btn-success" onClick={async ()=>{
                    setIsWorking(true);
                    await unlistNft(nft.itemData);
                    setIsWorking(false);
                  }}>Unlist</button>
                  {
                    nft.offerData && <button type="button" className="btn btn-success" onClick={async ()=>{
                      setIsWorking(true);
                      await acceptOffer(nft.itemData, nft.offerData, nft.offerPrice);
                      setIsWorking(false);
                    }}>Accept Offer</button>
                  }
                </div>
              </div>
            })
          }
          </div>
        </div>
        <div className="col-lg-4">
          <h4>Your Listed Offers</h4>
          <div className="row">
          {
            listedOffers.map((nft: any,idx)=>{
              return <div className="card m-3" key={idx} style={{"width" : "250px"}}>
                <img className="card-img-top" src={nft.image} alt="Image Error"/>
                <div className="card-img-overlay">
                  <h4>{nft.name}</h4>
                  <button type="button" className="btn btn-success" onClick={async ()=>{
                    setIsWorking(true);
                    await unlistOffer(nft.itemData, nft.itemAmount);
                    setIsWorking(false);
                  }}>Unlist</button>
                </div>
              </div>
            })
          }
          </div>
        </div>
      </div>

      <hr/>

      <div className="row">
        <div className="col-lg-12">
          <h4>All Listed NFTs</h4>
          <div className="row">
          {
            allListedNfts.map((nft: any,idx)=>{
              return <div className="card m-3" key={idx} style={{"width" : "250px"}}>
                <img className="card-img-top" src={nft.image} alt="Image Error"/>
                <div className="card-img-overlay">
                  <h4>{nft.name}</h4>
                  <button type="button" className="btn btn-success" onClick={async ()=>{
                    setIsWorking(true);
                    await listOffer(nft.address, 0.5);
                    setIsWorking(false);
                  }}>Offer</button>
                </div>
              </div>
            })
          }
          </div>
        </div>
      </div>
    </div>
    :
    <div className="text-center">Please Connect Wallet</div>
    }
    {(wallet && isWorking) &&
      <div className="loading">
      </div>
    }
	</div>
}