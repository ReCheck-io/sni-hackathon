const BN = require("bn.js");
const HT = artifacts.require("AqgGuard");

contract("AqgGuard", (accounts) => {
  const owner = accounts[0];
  const contributor = accounts[1];
  let ht;

  it("should match default contributor", () => {
    return HT.deployed()
      .then((instance) => {
        ht = instance;
        return;
      })
      .then(async () => {
        let c = await ht.contributor();
        assert.equal(c, contributor, "Contract has matched contributor.");
      });
  });

  it("should set contributor correctly", () => {
    return HT.deployed()
      .then((instance) => {
        ht = instance;
        return;
      })
      .then(async () => {
        await ht.setContributor(accounts[2]);
        let c = await ht.contributor();
        assert.equal(c, accounts[2], "Streak sequence is set.");
      });
  });

  it("should set streak period correctly", () => {
    return HT.deployed()
      .then((instance) => {
        ht = instance;
        return;
      })
      .then(async () => {
        await ht.setStreakSequenceThreshold(8);
        let c = await ht.streakSequenceThreshold();
        assert.equal(c, 8, "Streak sequence period is set.");
      });
  });

  it("should set PM2.5 level thresholds correctly", () => {
    return HT.deployed()
      .then((instance) => {
        ht = instance;
        return;
      })
      .then(async () => {
        await ht.setMetricLevelThreshold(1, 1, 35);
        await ht.setMetricLevelThreshold(1, 2, 25);
        await ht.setMetricLevelThreshold(1, 3, 15);
        await ht.setMetricLevelThreshold(1, 4, 10);
        await ht.setMetricLevelThreshold(1, 5, 5);
        assert.equal(
          await ht.thresholdsPm25(1),
          35,
          "Streak threshold is set to 35."
        );
        assert.equal(
          await ht.thresholdsPm25(2),
          25,
          "Streak threshold is set to 25."
        );
        assert.equal(
          await ht.thresholdsPm25(3),
          15,
          "Streak threshold is set to 15."
        );
        assert.equal(
          await ht.thresholdsPm25(4),
          10,
          "Streak threshold is set to 10."
        );
        assert.equal(
          await ht.thresholdsPm25(5),
          5,
          "Streak threshold is set to 5."
        );
      });
  });
  it("should set PM10 level thresholds correctly", () => {
    return HT.deployed()
      .then((instance) => {
        ht = instance;
        return;
      })
      .then(async () => {
        await ht.setMetricLevelThreshold(2, 1, 70);
        await ht.setMetricLevelThreshold(2, 2, 50);
        await ht.setMetricLevelThreshold(2, 3, 30);
        await ht.setMetricLevelThreshold(2, 4, 20);
        await ht.setMetricLevelThreshold(2, 5, 15);
        assert.equal(
          await ht.thresholdsPm10(1),
          70,
          "Streak threshold is set to 70."
        );
        assert.equal(
          await ht.thresholdsPm10(2),
          50,
          "Streak threshold is set to 50."
        );
        assert.equal(
          await ht.thresholdsPm10(3),
          30,
          "Streak threshold is set to 30."
        );
        assert.equal(
          await ht.thresholdsPm10(4),
          20,
          "Streak threshold is set to 20."
        );
        assert.equal(
          await ht.thresholdsPm10(5),
          15,
          "Streak threshold is set to 15."
        );
      });
  });

  it("should set PM2.5 level rewards correctly", () => {
    return HT.deployed()
      .then((instance) => {
        ht = instance;
        return;
      })
      .then(async () => {
        await ht.setMetricLevelReward(1, 1, 100);
        await ht.setMetricLevelReward(1, 2, 200);
        await ht.setMetricLevelReward(1, 3, 300);
        await ht.setMetricLevelReward(1, 4, 400);
        await ht.setMetricLevelReward(1, 5, 500);
        assert.equal(
          await ht.rewardsMap25(1),
          100,
          "Streak reward is set to 100."
        );
        assert.equal(
          await ht.rewardsMap25(2),
          200,
          "Streak reward is set to 200."
        );
        assert.equal(
          await ht.rewardsMap25(3),
          300,
          "Streak reward is set to 300."
        );
        assert.equal(
          await ht.rewardsMap25(4),
          400,
          "Streak reward is set to 400."
        );
        assert.equal(
          await ht.rewardsMap25(5),
          500,
          "Streak reward is set to 500."
        );
      });
  });
  it("should set PM10 level rewards correctly", () => {
    return HT.deployed()
      .then((instance) => {
        ht = instance;
        return;
      })
      .then(async () => {
        await ht.setMetricLevelReward(2, 1, 100);
        await ht.setMetricLevelReward(2, 2, 200);
        await ht.setMetricLevelReward(2, 3, 300);
        await ht.setMetricLevelReward(2, 4, 400);
        await ht.setMetricLevelReward(2, 5, 500);
        assert.equal(
          await ht.rewardsMap10(1),
          100,
          "Streak reward is set to 100."
        );
        assert.equal(
          await ht.rewardsMap10(2),
          200,
          "Streak reward is set to 200."
        );
        assert.equal(
          await ht.rewardsMap10(3),
          300,
          "Streak reward is set to 300."
        );
        assert.equal(
          await ht.rewardsMap10(4),
          400,
          "Streak reward is set to 400."
        );
        assert.equal(
          await ht.rewardsMap10(5),
          500,
          "Streak reward is set to 500."
        );
      });
  });

  it("should detect streak for level 1 correctly", () => {
    return HT.deployed()
      .then((instance) => {
        ht = instance;
        return;
      })
      .then(async () => {
        let sequence = [35, 35, 35, 35, 35, 35, 35, 35];
        let level = await ht.checkStreak(1, sequence);
        assert.equal(level, 1, "Streak sequence detected for level 1.");
      });
  });

  it("should not detect any streak", () => {
    return HT.deployed()
      .then((instance) => {
        ht = instance;
        return;
      })
      .then(async () => {
        let sequence = [35, 36, 35, 35, 35, 35, 35, 35];
        let level = await ht.checkStreak(1, sequence);
        assert.equal(level, 0, "Streak sequence not detected.");
      });
  });
  it("should detect streak on level 2", () => {
    return HT.deployed()
      .then((instance) => {
        ht = instance;
        return;
      })
      .then(async () => {
        let sequence = [14, 30, 25, 25, 25, 25, 25, 25, 25, 25, 40];
        let level = await ht.checkStreak(1, sequence);
        assert.equal(level, 2, "Streak sequence detected on level 2.");
      });
  });
  it("should execute reward distrbution", () => {
    return HT.deployed()
      .then((instance) => {
        ht = instance;
        return;
      })
      .then(async () => {
        let sequence = [14, 30, 25, 25, 25, 25, 25, 25, 25, 25, 40];
        await ht.requestReward(1, sequence);
      });
  });
});
