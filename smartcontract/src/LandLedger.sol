// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract LandLedger {
    error LandLedger__NotOwner();
    error LandLedger__LandDoesNotExist();
    struct Land {
        uint256 id;
        string location;
        string ownerName;
        address ownerAddress;
        string documentHash; // IPFS hash of the land document
        bool exists;
    }

    mapping(uint256 => Land) public lands;
    mapping(address => uint256[]) public ownerLands;
    uint256 public landCount;

    event LandRegistered(
        uint256 indexed landId,
        string location,
        string ownerName,
        address indexed ownerAddress,
        string documentHash
    );
    event OwnershipTransferred(
        uint256 indexed landId,
        address indexed oldOwner,
        address indexed newOwner
    );

    modifier onlyOwner(uint256 landId) {
        if (msg.sender != lands[landId].ownerAddress) {
            revert LandLedger__NotOwner();
        }
        _;
    }

    function registerLand(
        string memory _location,
        string memory _ownerName,
        string memory _documentHash
    ) public {
        landCount++;
        lands[landCount] = Land(
            landCount,
            _location,
            _ownerName,
            msg.sender,
            _documentHash,
            true
        );
        ownerLands[msg.sender].push(landCount);

        emit LandRegistered(
            landCount,
            _location,
            _ownerName,
            msg.sender,
            _documentHash
        );
    }

    function transferOwnership(
        uint256 landId,
        address newOwner
    ) public onlyOwner(landId) {
        address oldOwner = lands[landId].ownerAddress;
        lands[landId].ownerAddress = newOwner;
        lands[landId].ownerName = "New Owner"; // Update this as needed

        // Remove land from old owner's list
        removeLandFromOwner(oldOwner, landId);
        ownerLands[newOwner].push(landId);

        emit OwnershipTransferred(landId, oldOwner, newOwner);
    }

    function removeLandFromOwner(address owner, uint256 landId) internal {
        uint256[] storage landIds = ownerLands[owner];
        for (uint256 i = 0; i < landIds.length; i++) {
            if (landIds[i] == landId) {
                landIds[i] = landIds[landIds.length - 1];
                landIds.pop();
                break;
            }
        }
    }

    function getLandDetails(uint256 landId) public view returns (Land memory) {
        if (!lands[landId].exists) {
            revert LandLedger__LandDoesNotExist();
        }
        return lands[landId];
    }

    function getOwnerLands(
        address owner
    ) public view returns (uint256[] memory) {
        return ownerLands[owner];
    }
}
