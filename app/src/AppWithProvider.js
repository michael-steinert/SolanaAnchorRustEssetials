/* Wallet Configuration as specified here: https://github.com/solana-labs/wallet-adapter#setup */
import {ConnectionProvider, WalletProvider} from "@solana/wallet-adapter-react";
import {WalletModalProvider} from "@solana/wallet-adapter-react-ui";
import {getPhantomWallet} from "@solana/wallet-adapter-wallets";
import App from "./App";
import {useMemo} from "react";

const wallets = useMemo(() => [
    /* List of available Wallets at https://github.com/solana-labs/wallet-adapter#wallets */
    getPhantomWallet()
], []);

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