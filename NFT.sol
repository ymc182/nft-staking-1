// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "erc721a/contracts/ERC721A.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";

contract NFT is ERC721A, Ownable, ERC721Holder {
    using Strings for uint256;
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;
    //======= NFT Variables==========
    uint256 public constant MAX_SUPPLY = 3333;
    uint256 public maxMint = 10;
    address farmAddress;
    bool public sale_active = true;
    uint256 presale_time_end = 0;
    bool public is_revealed = false;
    //Uri for Real NFT ipfs ###Remember end with /
    string baseURI =
        "https://gateway.pinata.cloud/ipfs/QmdoqYbQpCJoayu4EBHPe1P1kXHNSqwJrXm3fBjdz3x7Jc/";
    //Uri for mastery box NFT ipfs  ###Remember end with /
    string public notRevealedUri =
        "https://gateway.pinata.cloud/ipfs/QmeZqBmQxUHeKqerUM7zc72VxjjW9s3ZwSyWCuBpTdNhS7/0.png";
    uint256 public mintPrice = 0.1 ether;
    uint256 public presaleMintPrice = 0.1 ether;

    string baseExtension = ".json";
    //Change to your image type .gif / .png
    string imageExtension = ".png";

    constructor() ERC721A("BinAnt NFT", "BANT") {}

    function startPreSale(uint256 durationInSeconds) external onlyOwner {
        require(presale_time_end == 0, "Presale Already Started");
        sale_active = true;
        presale_time_end = block.timestamp + durationInSeconds;
    }

    function mintNFT(uint256 tokenQuantity) public payable {
        require(sale_active == true, "Sales not active");
        require(
            totalSupply() + tokenQuantity <= MAX_SUPPLY,
            "Sale would exceed max supply"
        );
        if (presale_time_end != 0 && block.timestamp < presale_time_end) {
            require(
                tokenQuantity * presaleMintPrice <= msg.value,
                "Not enough ether sent"
            );
        } else {
            require(
                tokenQuantity * mintPrice <= msg.value,
                "Not enough ether sent"
            );
        }
        require(tokenQuantity <= maxMint, "You can only mint 10 at a time");
        _mintNFT(tokenQuantity);
    }

    function _mintNFT(uint256 tokenQuantity) internal {
        _safeMint(msg.sender, tokenQuantity);
    }

    function _mintNFTToAddress(address player, uint256 tokenQuantity) internal {
        _safeMint(player, tokenQuantity);
    }

    function getAllOwners() public view returns (address[] memory) {
        uint256 totalNumberOfTokens = totalSupply();
        address[] memory _owners = new address[](totalNumberOfTokens);
        for (uint256 i = 0; i < totalNumberOfTokens; i++) {
            _owners[i] = ownerOf(i);
        }
        return _owners;
    }

    function getCurrentPrice() external view returns (uint256 price) {
        if (presale_time_end != 0 && block.timestamp < presale_time_end) {
            return presaleMintPrice;
        } else {
            return mintPrice;
        }
    }

    function getTokensOfOwner(address _address)
        public
        view
        returns (uint256[] memory tokens)
    {
        require(balanceOf(_address) > 0, "Address do not hold any NFT");
        uint256 length = balanceOf(_address);
        uint256[] memory array = new uint256[](length);
        uint256 count = 0;
        for (uint256 i = 0; i < totalSupply(); i++) {
            if (ownerOf(i) == _address) {
                array[count] = i;
                count++;
            }
        }
        return array;
    }

    function getBaseURI() public view returns (string memory) {
        if (!is_revealed) {
            return notRevealedUri;
        }
        return baseURI;
    }

    function tokenURI(uint256 tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        require(
            _exists(tokenId),
            "ERC721Metadata: URI query for nonexistent token"
        );
        if (!is_revealed) {
            return notRevealedUri;
        }

        return
            string(
                abi.encodePacked(baseURI, tokenId.toString(), baseExtension)
            );
    }

    function tokenImage(uint256 tokenId)
        public
        view
        virtual
        returns (string memory)
    {
        require(
            _exists(tokenId),
            "ERC721Metadata: URI query for nonexistent token"
        );
        if (!is_revealed) {
            return notRevealedUri;
        }
        return
            string(
                abi.encodePacked(baseURI, tokenId.toString(), baseExtension)
            );
    }

    function reserve(address player, uint256 amount) public onlyOwner {
        require(totalSupply() + amount <= MAX_SUPPLY);
        _mintNFTToAddress(player, amount);
    }

    function claimBalance() external onlyOwner {
        uint256 balance = address(this).balance;
        payable(msg.sender).transfer(balance);
    }

    function updateBaseUri(string memory newURI) external onlyOwner {
        baseURI = newURI;
    }

    function updateHiddenUri(string memory imageURI) external onlyOwner {
        notRevealedUri = imageURI;
    }

    function setPriceSalePrice(uint256 new_price) external onlyOwner {
        presaleMintPrice = new_price;
    }

    function flipSaleActive() external onlyOwner {
        sale_active = !sale_active;
    }

    function flipReveal() external onlyOwner {
        is_revealed = !is_revealed;
    }
}
