// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

//import "@openzeppelin/contracts/token/ERC721/IERC20.sol";
contract NFTFarm is Ownable, ERC721Holder {
    IERC721 public NFT;
    IERC20 public Token;
    event LockedStake(address indexed _from, uint256 tokenId, uint256 period);
    //=======Stake Rewards Variables=========
    uint256 reward_rate_per_seconds = 0;
    mapping(address => uint256[]) Address_Staked_NFT;
    mapping(address => uint256) Address_Last_Reward;
    mapping(uint256 => uint256) Token_Locked_Period;

    constructor(address nftAddress) {
        NFT = IERC721(nftAddress);
    }

    //, address _tokenAddress
    function setNFTAddress(address _nftAddress) public onlyOwner {
        NFT = IERC721(_nftAddress);
        //     Token = IERC20(_tokenAddress);
    }

    function setTokenAddress(address _tokenAddress) public onlyOwner {
        Token = IERC20(_tokenAddress);
    }

    function stake(uint256 tokenId) external {
        require(NFT.ownerOf(tokenId) == msg.sender, "Not NFT Owner");
        NFT.safeTransferFrom(msg.sender, address(this), tokenId, "0X00");
        Address_Staked_NFT[msg.sender].push(tokenId);
        if (Address_Last_Reward[msg.sender] == 0)
            Address_Last_Reward[msg.sender] = block.timestamp;
    }

    function unstake(uint256 tokenId) external {
        require(
            Address_Staked_NFT[msg.sender].length > 0,
            "Address have no staking NFT"
        );
        int256 index = findTokenIdIndexInArray(
            tokenId,
            Address_Staked_NFT[msg.sender]
        );
        require(index >= 0, "Token Id not exist in staked data");
        require(
            block.timestamp > Token_Locked_Period[tokenId],
            "Token is currently locked"
        );
        uint256 array_length = Address_Staked_NFT[msg.sender].length;

        NFT.safeTransferFrom(address(this), msg.sender, tokenId);
        Address_Staked_NFT[msg.sender][uint256(index)] = Address_Staked_NFT[
            msg.sender
        ][array_length - 1];
        Address_Staked_NFT[msg.sender].pop();
    }

    function stakeWithTimeLock(uint256 tokenId, uint256 timeInDay) external {
        require(NFT.ownerOf(tokenId) == msg.sender, "Not NFT Owner");
        uint256 lockTime = timeInDay * 86400;
        NFT.safeTransferFrom(msg.sender, address(this), tokenId, "0X00");
        Address_Staked_NFT[msg.sender].push(tokenId);
        if (Address_Last_Reward[msg.sender] == 0)
            Address_Last_Reward[msg.sender] = block.timestamp;
        Token_Locked_Period[tokenId] = block.timestamp + lockTime;
        emit LockedStake(msg.sender, tokenId, lockTime);
    }

    function emergengyUnlock(uint256 tokenId) external onlyOwner {
        Token_Locked_Period[tokenId] = 0;
    }

    function findTokenIdIndexInArray(uint256 tokenId, uint256[] memory arry)
        internal
        pure
        returns (int256)
    {
        for (uint256 i = 0; i < arry.length; i++) {
            if (arry[i] == tokenId) {
                return int256(i);
            }
        }
        return -1;
    }

    function getStakedToken(address stakerAddress)
        public
        view
        returns (uint256[] memory)
    {
        return Address_Staked_NFT[stakerAddress];
    }

    //Reward Methods

    function claimReward() external payable {
        uint256 nftAmount = Address_Staked_NFT[msg.sender].length;
        require(nftAmount > 0, "Address do not hold any BinAnt NFT");
        require(
            Address_Last_Reward[msg.sender] != 0,
            "Address has no stake record"
        );
        uint256 time_now = block.timestamp;
        uint256 reward_amount = (time_now - Address_Last_Reward[msg.sender]) *
            nftAmount *
            reward_rate_per_seconds;
        require(reward_amount > 0, "Address do not have any reward");
        Token.transfer(msg.sender, reward_amount);
        Address_Last_Reward[msg.sender] = time_now;
    }

    function setRewardRate(uint256 new_rate) external onlyOwner {
        reward_rate_per_seconds = new_rate * 10**18;
    }

    function getRewardEstimate() external view returns (uint256) {
        uint256 nftAmount = Address_Staked_NFT[msg.sender].length;
        require(nftAmount > 0, "Address do not hold any BinAnt NFT");
        uint256 time_now = block.timestamp;
        require(
            Address_Last_Reward[msg.sender] != 0,
            "Address has no stake record"
        );
        uint256 reward_amount = (time_now - Address_Last_Reward[msg.sender]) *
            reward_rate_per_seconds *
            nftAmount;
        return reward_amount;
    }
}
