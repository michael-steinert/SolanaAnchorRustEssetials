# Solana
* Solana is currently the most performant permissionless Blockchain in the World
* To achieve this, the following Technologies are used:
  * __Proof of History (POH)__ - a cryptographic Timestamp before Consensus
  * __Tower BFT__ - a PoH-optimized Version of PBFT (Practical Byzantine Fault Tolerance)
  * __Turbine__ - a Block Propagation Protocol
  * __Gulf Stream__ - Mempool-less Transaction Forwarding Protocol
  * __Sealevel__ - a parallel Smart Contracts Runtime
  * __Pipelining__ - a Transaction Processing Unit for Validation Optimization
  * __Cloudbreak__ - a horizontally-scaled Accounts Database
  * __Archivers__ — a distributed Ledger Store

## Proof of History (PoH)
* Synchronized Clocks can be used to improve the Performance of distributed algorithms -  they make it possible to replace Communication with local Computation
* With PoH it is possible to create a historical Record that proves that an Event has occurred at a specific Moment in Time
* The Proof of History is a high frequency Verifiable Delay Function
* A verifiable Delay Function requires a specific Number of sequential Steps to evaluate, yet produces a unique Output that can be efficiently and publicly verified
* This makes it possible to be sure that Real Time has elapsed between each Counter as it was generated and that the recorded Sequence of each Counter matches in the Real Time
* The Advantage of PoH is that a recorded Sequence can only be generated on a single CPU Core, but the Output can be verified in parallel CPU Cores

## Tower BFT
* Tower BFT is Solana’s high Performance Implementation of PBFT (Practical Byzantine Fault Tolerance)
* It uses Solana’s PoH as a Clock before Consensus to reduce Messaging Overhead and Latency
* Proof of History (PoH) provides a global Source of Time before Consensus
* The Basic Principles of how PoH works are as follows:
  * Sha256 loops as fast as possible, such that each Output is the next Input
  * The Loop is sampled, and the Number of Iterations and State are recorded
* The recorded Samples represent the Passage of Time encoded as a verifiable Data Structure
* In addition, this Loop can be used to record the following Events:
  * Messages that reference any of the Samples are guaranteed to have been created after the Sample
  * Messages can be inserted into the Loop and hashed together with the State - this guarantees that a Message was created before the next Insert
* This Data Structure guarantees both the Time and the Sequence of Events embedded in it
* The Advantages of the Tower BFT are:
  * All the Nodes that examine this Data Structure will compute the exact same result, without requiring any P2P-Communication
  * The PoH Hash uniquely identifies that Fork of the Ledger
  * A validation Vote Message is only valid if the PoH Hash that it voted on is present in the Ledger
* Tower BFT allows the Network to continuously stream Blocks without stalling the Ledger until a Majority observes the same Ledger
* IT also allows that every Participant in the Network can compute the Timeouts for every other Participant without any P2P-Communications - this makes Tower BFT asynchronous

### PBFT (Practical Byzantine Fault Tolerance)
* PBFT is a Consensus Mechanism used when Validating new Blocks for a Blockchain
* This Consensus Mechanism uses Participants with registered Identities as well as redundant Voting for the Validation of new Blocks
* Therefore, Attackers have a relatively high Barrier to entry, and thus they are detected faster
  * PBFT uses redundant Queries to make the System more robust against erroneous, missing, and deliberately manipulated Messages
  * This is realized by the Validation or Approval of the Attachment of a new Block as a Voting Procedure with several Rounds
  * It is Part of PBFT that Participants are linked to a real, trusted Identity
  * For this Purpose, the Identity of the Participants can also be permanently registered at a central Location, so that Identities and Transactions can be tracked accurately

## Turbine
* Turbine is Solana’s Block Propagation Protocol that solves the Scalability Trilemma of Blockchains
* It is optimized for Streaming, and transmits Data using UDP only, and implements a random Path per Packet through the Network as Leader (Block Producers) stream their Data
* The Leaders (Block Producers) breaks the Block into Packets up to 64 KB in Size, and transmits each Packet to a different Validator

<p align="center">
  <img src="https://user-images.githubusercontent.com/29623199/145829570-fbbec465-ac42-4193-be7c-0964004c264d.png" alt="Leader-Validator-Relationship" width="65%"/>
</P>

* Each Validator retransmits the Packet to a Group of Peers (Neighborhood)

<p align="center">
  <img src="https://user-images.githubusercontent.com/29623199/145829869-3db01f3e-7f6f-4fb0-924f-23735f89e145.png" alt="Neighborhood-Relationship" width="75%"/>
</P>

* Each Neighborhood is responsible for Transmitting a Portion of its Data to each Neighborhood below it

<p align="center">
  <img src="https://user-images.githubusercontent.com/29623199/145830179-2293e3ac-1e08-442d-a338-35e9f77b3f9e.png" alt="Neighborhood-Transmitting" width="65%"/>
</P>

* Not all Validators are created equal - the most important Validators are those with the most Stake
* A Stake-weighted Selection Algorithm constructs the Tree such that the higher Staked Validators are at Neighborhoods closer to the Leader
* Each Validator independently computes the same Tree

## Gulf Stream
* Gulf Stream is Solana’s Mempool-less Transaction Forwarding Protocol
* It is a Mempool Management Solution for a high Performance adversarial Network
* It pushes Transaction Caching and Forwarding to the Edge of the Network:
  * Since every Validator knows the Order of upcoming Leaders, Clients and Validators forward Transactions to the expected Leader ahead of Time
  * This allows Validators to execute Transactions ahead of Time, reduce Confirmation Times, switch Leaders faster, and reduce the Memory Pressure on Validators from the unconfirmed Transaction Pool (Mempool)
* Once a Transaction is forwarded to any Validator, the Validator forwards it to one of the upcoming Leaders
* Clients can subscribe to Transaction Confirmations from Validators
* Clients know that a Block-Hash expires in a finite Period of Time, or the Transaction is confirmed by the Network
* This allows Clients to sign Transactions that are guaranteed to execute or fail
* The Advantages of Gulf Stream are:
  * Under load Validators can execute Transactions ahead of Time and drop any that fail
  * Leaders can prioritize processing Transactions based on Stake weight of the validator that forwarded the Transaction

### Mempool
* A Mempool is a Set of Transactions that have been submitted, but have not yet been processed by the Network
* The Size of the Mempool — which is measured as Number of unconfirmed Transactions — depends on Supply and Demand for Blockspace
* Mempools in Ethereum and Bitcoin are propagated between random Nodes in P2P Fashion using a Gossip Protocol
* Nodes in the Network periodically construct a Bloom Filter representing a local Mempool and request any Transactions that do not match that Filter from other nodes on the Network

## Sealevel
* Sealevel is Solana’s parallel Smart Contracts Runtime
* To consider is that the Ethereum Virtual Machine is single threaded - that means that one Smart Contract at a Time modifies the Blockchain State
* Sealevel is a Runtime that can process Tens of Thousands of Smart Contracts in parallel, using as many Cores as are available to the Validator
* The Reason Sealevel is able to process Transactions in parallel is that the Transactions describe all the States that a Transaction will read or write during its Execution
* This allows not only the concurrent Execution of non-overlapping Transactions, but also the concurrent Execution of Transactions that only read the same State

### Programs and Accounts
* Cloudbreak is Solana’s Accounts Database
* It is a Mapping of Public Keys to Accounts
* Accounts maintain Balances and Data, where data is a Vector of Bytes
* Accounts have an “owner” Field
* The Owner is the Public Key of the Program that governs the State Transitions for the Account
* Programs are Code and have no State - they rely on the Data Vector in the Accounts assigned to them for State Transitions
* Programs have the following Constraints:
  * Programs can only change the Data of Accounts they own
  * Programs can only debit Accounts they own
  * Any Program can credit any Account
  * Any Program can read any Account
* By Default, all Accounts start as owned by the System Program:
  * System Program is the only Program that can assign Account Ownership
  * System Program is the only Program that can allocate Zero-initialized Data
  * Assignment of Account Ownership can only occur once in the Lifetime of an Account
* A User-defined Program is loaded by the __Loader Program__
* The __Loader Program__ is able to mark the Data in the Accounts as executable
* The User performs the following Transactions to load a Custom Program:
  1) Create a new public Key
  2) Transfer Coins to the Key
  3) Tell System Program to allocate Memory
  4) Tell System Program to assign the Account to the Loader Program
  5) Upload the Bytecode into the Memory in Pieces
  6) Tell Loader Program to mark the Memory as executable
* The Loader Program verifies the Bytecode, and the Account to which the Bytecode is loaded into can be used as an executable Program
* Programs are Code, and within the Key-Value Store, there exists some Subset of Keys that only the Program has Write Access

### Transactions
* Transactions specify an Instruction Vector
* Each Instruction contains the Program, Program Instruction, and a List of Accounts the Transaction wants to read and write
* Each instruction tells the VM which Accounts it wants to read and write ahead of Time - this allows to optimizations to the VM:
  * Sort Millions of pending Transactions
  * Schedule all the non-overlapping Transactions in parallel

## Pipelining
* Pipelining is Solana’s Transaction Processing Unit (TPU) for Validation Optimization
* Pipelining is a Mechanism of processing a Stream of Input Data through a Sequence of Steps, with different Hardware responsible for each Step
* The TPU progresses through Data Fetching at the Kernel Level, Signature Verification at the GPU Level, Banking at the CPU Level, and Writing at the Kernel Space
* By the Time the TPU starts to send Blocks out to the Validators, it is already fetched in the next Set of Packets, verified their Signatures, and begun crediting Tokens

<p align="center">
  <img src="https://user-images.githubusercontent.com/29623199/145850212-907bc18b-affc-48f6-9d34-54c2b2c86dcb.png" alt="Transactional Processing Unit" width="75%"/>
</P>

## Cloudbreak
* Cloudbreak is Solana’s horizontally scaled State Architecture (Database)
* It leverages Memory-mapped Files - a Memory-mapped File is a File whose Bytes are mapped into the virtual Address Space of a Process
* IT uses sequential Operations instead of random Operations because sequential Operations are much faster
* To achieve the sequential Operations the Account’s Data Structure is break up as follows:
1) The Index of Accounts and Forks is stored in RAM
2) Accounts are stored in Memory-mapped Files up to 4 MB in Size
3) Each Memory Map only stores Accounts from a single proposed Fork
4) Maps are randomly distributed across as many SSDs as are available
5) Copy-on-write Semantics are used
6) Writes are appended to a random Memory map for the same Fork
7) The Index is updated after each write is completed
* Cloudbreak also performs a form of Garbage Collection - as Forks become finalized beyond Rollback and Accounts are updated, old invalid Accounts are Garbage-collected, and Memory is relinquished
* The Computing of the Merkle Root of the State Updates for any given Fork can be done with sequential Reads that are horizontally scaled across SSDs

## Archivers
* Archivers are specialized Light Clients
* They download a Part of the Ledger (a.k.a. Segment) and store it, and provide PoReps (Proof-of-Replication) of storing the Ledger
* For each verified PoRep (Proof-of-Replication) Archivers earn a Reward of SOL from the Mining Pool
* The Game between Validators and Archivers is over random Blocks and random Encryption Identities and random Data Samples
* The Goal of Randomization is to prevent colluding Groups from having Overlap on Data or Validation
* Archiver Clients fish for lazy Validators by submitting Fake Proofs that they can prove are fake

<hr/>

## Solana CLI
* The Solana CLI allows to configure the Network well as doing an Airdrop of Tokens into to a Wallet

| Command                                                 | Description                                                                                    |
|---------------------------------------------------------|------------------------------------------------------------------------------------------------|
| solana config get                                       | Getting current Network Configuration                                                          |
| solana-keygen new -o ~\.config\solana\id.json           | Generating a new Keypair (in ~/.config/solana/id.json) and deriving Public Key (Wallet Address) |
| solana config set --url localhost                       | Setting Network to localhost (Wallet has to have the same Network as the local Environment)    |
| solana config set --url devnet                          | Setting Network to devnet (Wallet has to have the same Network as the local Environment)       |
| solana address                                          | Getting current Address (lcoal Wallet)                                                         |
| solana account <address>                                | Getting Details about an Account                                                               |
| solana-test-validator                                   | Starting the local Network (first, change to the Home Directory - cd ~/)                       |
| solana airdrop 42 <address>                             | Airdropping some SOL Tokens to given Address                                                   |
| solana balance <address>                                | Showing Balance of given Address                                                               |
| solana address -k target/deploy/solana_app-keypair.json | Getting dynamically generated Program ID                                                       |

<hr/>

## Anchor
* Anchor uses, and enables to write, an eDSL (embedded DSL) that abstracts away many of complex Low Level Operations from Solana and Rust
* IDLs (Interface Description Language) are used in JavaScript Tests and Front Ends to communicate with Solana Programs via RPC

## Anchor CLI
* The Solana CLI allows to configure the Network well as doing an Airdrop of Tokens into to a Wallet

| Command                             | Description                            |
|-------------------------------------|----------------------------------------|
| anchor init solana-app --javascript | Initialize an empty Anchor Project     |
| anchor build                        | Compile a Program                      |
| anchor test                         | Test a Program                         |
| anchor test --skip-local-validator  | Test a Program (if Testnet is running) |
| anchor deploy                       | Deploye a Program with Deploy Script   |

## Anchor Project Structure

| Folder      | Description                                               |
|-------------|-----------------------------------------------------------|
| app         | Front End Code                                            |
| programs    | Rust Code for the Solana Programs                         |
| test        | JavaScript Tests for Solana Programs                      |
| migrations  | Deploy Scripts for Solana Programs                        |
| target/idl/ | Created Artifacts in IDL (Interface Description Language) |

