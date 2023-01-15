//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

// import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract Transaction {
    // address deployer;
    // address public holder;
    // address payable public beneficiary;

    mapping(uint256 => Listing) public listings;
    mapping(address => uint256) public balances;
    uint256 public ListingCount = 0;

    struct Listing {
        string name;
        uint256 price;
        address seller;
    }

    constructor() {
        register("Initial Data", 100);
    }

    function register(string memory name, uint256 price) public {
        ListingCount++;
        listings[ListingCount] = Listing(name, price, msg.sender);
    }

    function purchase(uint256 idx) public payable {
        Listing memory item = listings[idx];
        require(msg.value >= item.price, "insufficient funds sent");
        balances[item.seller] += msg.value;
        item.seller = msg.sender;
    }

    function withdraw() public {
        // beneficiary = payable(msg.sender);
        uint value = balances[msg.sender];
        require(value > 0, "there is no balances");
        payable(msg.sender).transfer(value);
        balances[msg.sender] -= value;
    }

    function get(uint256 idx) public view returns (uint256) {
        return listings[idx].price;
    }


    // function upload(uint _price) public {

    // }

    // function changePrice() public {

    // }

    // function request() public {

    // }

    // function approve() public {

    // }


}