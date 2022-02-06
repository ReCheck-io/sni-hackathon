pragma solidity ^0.8.11;
//SPDX-License-Identifier: LGPL

import "./Owned.sol";
import "./ERC20Interface.sol";
import "./Erc20Aqg.sol";

contract AqgGuard is Owned {
    // the AQG token contract
    ERC20Interface public aqgCoin;

    // number of days of successful values to count as streak
    uint8 public streakSequenceThreshold = 7;

    // active contributor
    address public contributor;

    // Targets 4-1 plus AQG levels mapped to coin rewards
    mapping(uint8 => uint256) public rewardsMap25;
    mapping(uint8 => uint256) public rewardsMap10;

    // Each level has a thrshold to be kept for a streak
    mapping(uint8 => uint16) public thresholdsPm25;
    mapping(uint8 => uint16) public thresholdsPm10;

    // Event fired when a reward is in effect for a streak
    event Reward(uint8 metric, uint8 level, address rewardee, uint256 reward);

    // Event is fired when new funding amount is deposited in the smart contract
    event Funding(address investor, uint256 amount);

    // Event fired when the contributors change
    event NewContributor(address oldContributor, address newContributor);

    // Event fired when level thresholds for metrics change
    event LevelThreshold(
        uint8 metric,
        uint8 level,
        uint16 oldThreshold,
        uint16 newThrehsold
    );

    // Event fired when level rewards for metrics change
    event LevelReward(
        uint8 metric,
        uint8 level,
        uint256 oldReward,
        uint256 newReward
    );

    // This smart contract is dependent on the AQG coin
    // Needs the controbutor address as initial destination for rewards
    constructor(address coinContractAddress, address contributorAddress)
        Owned()
    {
        aqgCoin = Erc20Aqg(coinContractAddress);
        contributor = contributorAddress;
    }

    // read-only method for verifying that a sample reaches a streak
    function checkStreak(uint8 metric, uint16[] memory sequence)
        public
        view
        returns (uint8 level)
    {
        level = 0;
        for (uint8 day = 0; day < sequence.length; day++) {
            uint8 streakT1 = 0;
            uint8 streakT2 = 0;
            uint8 streakT3 = 0;
            uint8 streakT4 = 0;
            uint8 streakAqg = 0;
            mapping(uint8 => uint16) storage thresholds = metric == 1
                ? thresholdsPm25
                : thresholdsPm10;
            for (
                uint8 aheadDay = day;
                (aheadDay < day + streakSequenceThreshold) &&
                    (aheadDay < sequence.length);
                aheadDay++
            ) {
                if (sequence[aheadDay] <= thresholds[1] && level < 1)
                    streakT1++;
                if (sequence[aheadDay] <= thresholds[2] && level < 2)
                    streakT2++;
                if (sequence[aheadDay] <= thresholds[3] && level < 3)
                    streakT3++;
                if (sequence[aheadDay] <= thresholds[4] && level < 4)
                    streakT4++;
                if (sequence[aheadDay] <= thresholds[5] && level < 5)
                    streakAqg++;
            }
            if (streakT1 >= streakSequenceThreshold) level = 1;
            if (streakT2 >= streakSequenceThreshold) level = 2;
            if (streakT3 >= streakSequenceThreshold) level = 3;
            if (streakT4 >= streakSequenceThreshold) level = 4;
            if (streakAqg >= streakSequenceThreshold) level = 5;
        }
        return level;
    }

    // attempt to initiate a reward based on a sequence
    // attempting party should have the sequence verified before the tx to save gas in case of failure
    function requestReward(uint8 metric, uint16[] memory sequence)
        public
        onlyOwner
        returns (uint8 level)
    {
        mapping(uint8 => uint256) storage rewardsMap = metric == 1
            ? rewardsMap25
            : rewardsMap10;
        level = checkStreak(metric, sequence);
        if (level > 0) {
            uint256 reward = rewardsMap[level];
            aqgCoin.transfer(contributor, reward);
            emit Reward(metric, level, contributor, reward);
        }
        return level;
    }

    // A dedicated function to indicate funding as an event
    // Funding can happen by simply transfering coins to the address
    // of this contract. Funding is accepted by anyone.
    function fund(uint256 amount) public payable {
        aqgCoin.transferFrom(msg.sender, address(this), amount);
        emit Funding(msg.sender, amount);
    }

    // Sets a new contributor who will receive rewards afther the change.
    // Available only for contract owner.
    function setContributor(address newContributor) public onlyOwner {
        address oldContributor = contributor;
        contributor = newContributor;
        emit NewContributor(oldContributor, newContributor);
    }

    // Sets a new thresholdvalue for indication of a streak
    // Available only for contract owner.
    function setStreakSequenceThreshold(uint8 newStreakThreshold)
        public
        onlyOwner
    {
        streakSequenceThreshold = newStreakThreshold;
    }

    // Changes the levels threshold for specificied metric
    // Available only for contract owner.
    function setMetricLevelThreshold(
        uint8 metric,
        uint8 level,
        uint16 newThreshold
    ) public onlyOwner {
        mapping(uint8 => uint16) storage thresholds = metric == 1
            ? thresholdsPm25
            : thresholdsPm10;
        uint16 oldThreshold = thresholds[level];
        thresholds[level] = newThreshold;
        emit LevelThreshold(metric, level, oldThreshold, newThreshold);
    }

    // Changes the level rewards for specified metric
    // Available only for contract owner.
    function setMetricLevelReward(
        uint8 metric,
        uint8 level,
        uint256 newReward
    ) public onlyOwner {
        mapping(uint8 => uint256) storage rewardsMap = metric == 1
            ? rewardsMap25
            : rewardsMap10;
        uint256 oldReward = rewardsMap[level];
        rewardsMap[level] = newReward;
        emit LevelReward(metric, level, oldReward, newReward);
    }
}
