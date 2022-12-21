use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token::{self, Mint, Token, TokenAccount},
};

declare_id!("h9gqsge8CFzo2gajMwkUrWWp4RkX6xB6rrrQMhJfBkN");

#[program]
pub mod spl_transfer {
    use super::*;

    pub fn token_transfer(ctx: Context<TokenTransfer>, amount: u64) -> Result<()> {
        let cpi_ctx = CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            token::Transfer {
                from: ctx.accounts.from_token_account.to_account_info(),
                to: ctx.accounts.to_token_account.to_account_info(),
                authority: ctx.accounts.sender.to_account_info(),
            },
        );

        token::transfer(cpi_ctx, amount)?;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct TokenTransfer<'info> {
    #[account(mut)]
    pub sender: Signer<'info>,
    pub receiver: SystemAccount<'info>,
    #[account(
        mut,
        associated_token::mint = mint,
        associated_token::authority = sender
    )]
    pub from_token_account: Account<'info, TokenAccount>,
    #[account(
        init_if_needed,
        payer = sender,
        associated_token::mint = mint,
        associated_token::authority = receiver
    )]
    pub to_token_account: Account<'info, TokenAccount>,
    pub mint: Account<'info, Mint>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}
