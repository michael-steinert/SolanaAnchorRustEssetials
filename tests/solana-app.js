const assert = require("assert");
const anchor = require("@project-serum/anchor");
const {SystemProgram} = anchor.web3;

describe("solana-app", () => {
    /* Provider is an Abstraction of a Connection to the Solana Network */
    /* A Provider consists of a Connection, Wallet, and a preflight Commitment */
    const provider = anchor.Provider.env();
    anchor.setProvider(provider);
    let _baseAccount;

    /* program is an Abstraction that combines the Provider, IDL, and the ProgramID (which is generated when the program is built) */
    /* program allows calling RPC methods against the Program */
    const program = anchor.workspace.SolanaApp;
    it("Creates a counter)", async () => {
        /* Call the create function via RPC */
        const baseAccount = anchor.web3.Keypair.generate();
        await program.rpc.create({
            accounts: {
                baseAccount: baseAccount.publicKey,
                user: provider.wallet.publicKey,
                systemProgram: SystemProgram.programId,
            },
            signers: [baseAccount],
        });

        /* Fetch the Account and check the Value of Count */
        const account = await program.account.baseAccount.fetch(baseAccount.publicKey);
        console.log(`Count 0: ${account.count.toString()}`);
        assert.ok(account.count.toString() === "0");
        _baseAccount = baseAccount;

    });

    it("Increments the Counter", async () => {
        const baseAccount = _baseAccount;
        await program.rpc.increment({
            accounts: {
                baseAccount: baseAccount.publicKey,
            },
        });
        const account = await program.account.baseAccount.fetch(baseAccount.publicKey);
        console.log(`Count 1: ${account.count.toString()}`);
        assert.ok(account.count.toString() === "1");
    });
});