const {
    Connection,
    PublicKey,
    clusterApiUrl,
    Keypair,
    LAMPORTS_PER_SOL,
    Transaction,
    Account,
   } = require("@solana/web3.js");

//    create new wallet
   const newPair = new Keypair();

//    extract public key
const publicKey = new PublicKey(newPair._keypair.publicKey).toString();

// extract private key 
const secretKey = newPair._keypair.secretKey

// get wallet balance
const getWalletBalance = async () => {
    try {
        // create a connection object
        const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
        // create wallet object using secret key
        const myWallet = await Keypair.fromSecretKey(secretKey);

        // query the balance of this wallet
        const walletBalance = await connection.getBalance(
            new PublicKey(myWallet.publicKey)
        );
        console.log(`Wallet balance: ${walletBalance}`);
        console.log(`=> For wallet address ${publicKey}`);
        console.log(`   Wallet balance: ${parseInt(walletBalance)/LAMPORTS_PER_SOL}SOL`);
    } catch (err) {
        console.log(err);
    }
};

// function to airdrop SOL
const airDropSol = async () => {
    try {
        const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
        const walletKeyPair = await Keypair.fromSecretKey(secretKey);

        console.log(`-- Airdropping 2 SOL --`);
        // create airdrop signature
        const fromAirDropSignature = await connection.requestAirdrop(
            new PublicKey(walletKeyPair.publicKey),
            2 * LAMPORTS_PER_SOL
        );
        // await for a confirmation for the transaction from the network
        await connection.confirmTransaction(fromAirDropSignature);
    } catch (err) {
        console.log(err);
    }
};

// testing the function 
const driverFunction = async () => {
    await getWalletBalance();
    await airDropSol();
    await getWalletBalance();
}

driverFunction();