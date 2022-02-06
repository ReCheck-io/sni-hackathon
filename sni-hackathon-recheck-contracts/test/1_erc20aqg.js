const BN = require("bn.js");

const Coin = artifacts.require("Erc20Aqg");

contract("Erc20Aqg", (accounts) => {
  it("should have 1000000 AQG in the first account", () =>
    Coin.deployed()
      .then((instance) => instance.balanceOf.call(accounts[0]))
      .then((balance) => {
        assert.equal(
          balance.valueOf(),
          1000000000000000000000000,
          "1000000 wasn't in the first account"
        );
      }));

  it("should send coin correctly", () => {
    let aqg;

    // Get initial balances of first and second account.
    const account_one = accounts[0];
    const account_two = accounts[1];

    let account_one_starting_balance;
    let account_two_starting_balance;
    let account_one_ending_balance;
    let account_two_ending_balance;

    const amount = new BN("10000000000000000000"); // 10 coins

    return Coin.deployed()
      .then((instance) => {
        aqg = instance;
        return aqg.balanceOf.call(account_one);
      })
      .then((balance) => {
        account_one_starting_balance = balance;
        return aqg.balanceOf.call(account_two);
      })
      .then((balance) => {
        account_two_starting_balance = balance;
        return aqg.transfer(account_two, amount, { from: account_one });
      })
      .then(() => aqg.balanceOf.call(account_one))
      .then((balance) => {
        account_one_ending_balance = balance;
        return aqg.balanceOf.call(account_two);
      })
      .then((balance) => {
        account_two_ending_balance = balance;
        assert.equal(
          account_one_ending_balance.valueOf(),
          account_one_starting_balance.sub(amount).toString(),
          "Amount wasn't correctly taken from the sender"
        );
        assert.equal(
          account_two_ending_balance.valueOf(),
          account_two_starting_balance.add(amount).toString(),
          "Amount wasn't correctly sent to the receiver"
        );
      });
  });

  it("should mint coins correctly", () => {
    let aqg;

    // Get initial balances of first and second account.
    const account_one = accounts[0];
    const account_two = accounts[1];

    let totalSupplyBefore;
    let totalSupplyAfter;

    const amount = new BN("1000000000000000000000"); // 1000 new coins

    return Coin.deployed()
      .then((instance) => {
        aqg = instance;
        return aqg.totalSupply.call();
      })
      .then((supply) => {
        totalSupplyBefore = supply;
        return aqg.mint(amount, account_two, { from: account_one });
      })
      .then(() => {
        return aqg.totalSupply.call();
      })
      .then((supply) => {
        totalSupplyAfter = supply;
        assert.equal(
          totalSupplyBefore.valueOf(),
          totalSupplyAfter.sub(amount).toString(),
          "Minting didnt result to more greater totalSupply"
        );
      });
  });
});
