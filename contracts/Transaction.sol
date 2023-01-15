//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

// import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract Transaction {
    event Register(uint id, string name, uint256 price);
    event Purchase(uint id, string name, address buyer);
    event Withdraw(address _address, uint value);

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

    function register(string memory _name, uint256 _price) public {
        ListingCount++;
        listings[ListingCount] = Listing(_name, _price, msg.sender);
        emit Register(ListingCount, _name, _price);
    }

    function purchase(uint256 idx) public payable {
        Listing storage item = listings[idx];
        require(msg.sender != item.seller, "buyer & seller are equal");
        require(msg.value == item.price, "price & funds are not equal");
        balances[item.seller] += msg.value;
        item.seller = msg.sender;
        emit Purchase(idx, item.name, msg.sender);
    }

    function withdraw() public {
        // beneficiary = payable(msg.sender);
        uint value = balances[msg.sender];
        require(value > 0, "there is no balances");
        payable(msg.sender).transfer(value);
        balances[msg.sender] -= value;
        emit Withdraw(msg.sender, value);
    }



    // function changePrice() public {

    // }

    // function approve() public {

    // }


}