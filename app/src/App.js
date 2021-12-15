import {useState} from "react";
import {Connection, PublicKey} from "@solana/web3.js";
import {Program, Provider, web3} from "@project-serum/anchor";
import idl from "./idl/idl.json";
import {getPhantomWallet} from "@solana/wallet-adapter-wallets";
import {useWallet, WalletProvider, ConnectionProvider} from "@solana/wallet-adapter-react";
import {WalletModalProvider, WalletMultiButton} from "@solana/wallet-adapter-react-ui";

require("@solana/wallet-adapter-react-ui/styles.css");

const wallets = [
    /* List of available Wallets at https://github.com/solana-labs/wallet-adapter#wallets */
    getPhantomWallet()
]
const {SystemProgram, Keypair} = web3;
/* Create an Account  */
const baseAccount = Keypair.generate();
const opts = {
    preflightCommitment: "processed"
}
const programId = new PublicKey(idl.metadata.address);

function App() {
    const [value, setValue] = useState(null);
    const wallet = useWallet();

    async function getProvider() {
        /* Create the Provider and return it to the Caller */
        /* Network set to local Network */
        const network = "http://127.0.0.1:8899";
        const connection = new Connection(network, opts.preflightCommitment);
        const provider = new Provider(
            connection, wallet, opts.preflightCommitment,
        );
        return provider;
    }

    async function createCounter() {
        const provider = await getProvider()
        /* Create Program Interface combining the IDL, Program ID, and Provider */
        const program = new Program(idl, programId, provider);
        try {
            /* Interact with the Solana Program via RPC */
            await program.rpc.create({
                accounts: {
                    baseAccount: baseAccount.publicKey,
                    user: provider.wallet.publicKey,
                    systemProgram: SystemProgram.programId,
                },
                signers: [baseAccount]
            });
            /*
                To read the Contents of a Solana Program it is necessary to request the Account,
                from there it is able to view all the Program's state like count
            */
            const account = await program.account.baseAccount.fetch(baseAccount.publicKey);
            console.log("Account:", account);
            setValue(account.count.toString());
        } catch (error) {
            console.error("Transaction Error: ", error);
        }
    }

    async function increment() {
        const provider = await getProvider();
        const program = new Program(idl, programId, provider);
        await program.rpc.increment({
            accounts: {
                baseAccount: baseAccount.publicKey
            }
        });

        const account = await program.account.baseAccount.fetch(baseAccount.publicKey);
        console.log("Account: ", account);
        setValue(account.count.toString());
    }

    if (!wallet.connected) {
        /* If User's Wallet is not connected, then display Connect Wallet Button */
        return (
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "100px"
                }}
            >
                <WalletMultiButton/>
            </div>
        )
    } else {
        return (
            <div className="App">
                <div>
                    {
                        !value && (
                            <button onClick={createCounter}>Create counter</button>
                        )
                    }
                    {
                        value && (
                            <button onClick={increment}>Increment counter</button>
                        )
                    }

                    {
                        value && value >= Number(0) ? (
                            <h2>{value}</h2>
                        ) : (
                            <h3>Please create the Counter</h3>
                        )
                    }
                </div>
            </div>
        );
    }
}

/* Wallet Configuration as specified here: https://github.com/solana-labs/wallet-adapter#setup */
const AppWithProvider = () => (
    <ConnectionProvider endpoint="http://127.0.0.1:8899">
        <WalletProvider wallets={wallets} autoConnect>
            <WalletModalProvider>
                <App/>
            </WalletModalProvider>
        </WalletProvider>
    </ConnectionProvider>
)

export default AppWithProvider;