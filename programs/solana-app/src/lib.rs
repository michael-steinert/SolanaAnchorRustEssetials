use anchor_lang::prelude::*;

declare_id!("2XQVADahsLwN4XGNTKc4i57GhXMXqNN8WsNjABtSNZcK");

#[program]
pub mod solana_app {
    use super::*;

    // RPC Request Handlers are be able to be called from a Client Application to interact with the Solana Program
    // RPC Request Handler - Function defines a Context struct,
    // which describes the Context that will be passed in when the Function is called and how to handle it
    // Expected are three Parameters from the Context: base_account, user, and system_program
    pub fn create(ctx: Context<Create>) -> ProgramResult {
        let base_account = &mut ctx.accounts.base_account;
        base_account.count = 0;
        Ok(())
    }

    // RPC Request Handler - Function defines the Context as being empty of any Arguments
    pub fn increment(ctx: Context<Increment>) -> ProgramResult {
        let base_account = &mut ctx.accounts.base_account;
        base_account.count += 1;
        Ok(())
    }
}

// Defining Constraints and Instructions that are related to the proceeding Account where declared
// If any of these Constraints do not hold, then the Instruction will never execute
#[derive(Accounts)]
pub struct Create<'info> {
    #[account(init, payer = user, space = 16 + 16)]
    // Any Client calling this Program with the right base_account can call these RPC Methods
    pub base_account: Account<'info, BaseAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program <'info, System>,
}

// Defining Constraints and Instructions that are related to the proceeding Account where declared
#[derive(Accounts)]
pub struct Increment<'info> {
    #[account(mut)]
    // Any Client calling this Program with the right base_account can call these RPC Methods
    pub base_account: Account<'info, BaseAccount>,
}

// An account that goes inside a transaction instruction
#[account]
pub struct BaseAccount {
    pub count: u64,
}
