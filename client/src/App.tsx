import './App.css';

import { ethers } from 'ethers';
import React, { FC, useEffect, useState } from 'react';

import { Box, Button, TextField } from '@mui/material';

import artifact from './abi/Transaction.json';
import config from './client_config';
import Header from './components/Header';

type ContentProps = {
    contract: ethers.Contract;
};

type List = {
    id: string;
    name: string;
    price: number;
    seller: string;
};

const useContent = (contract: ethers.Contract) => {
    const { listings, ListingCount, purchase, register } = contract.functions;
    const [listContValue, setListCountValue] = useState<string>("");
    const [ListsValue, setListsValue] = useState<List[]>([]);

    const [itemName, setItemName] = useState<string>("");
    const [itemPrice, setItemPrice] = useState<string>("");

    useEffect(() => {
        const getLists = async () => {
            const _listCount = await ListingCount();
            setListCountValue(_listCount);

            const _lists = [];
            for (let i = 1; i <= _listCount; i++) {
                const _task = await listings(i);
                _lists.push({
                    ..._task,
                    id: i,
                });
            }
            setListsValue(_lists);
        };
        getLists();
    }, []);

    const updateItemName = (e: React.ChangeEvent<HTMLInputElement>) =>
        setItemName(e.target.value);

    const updateItemPrice = (e: React.ChangeEvent<HTMLInputElement>) =>
        setItemPrice(e.target.value);

    const requestPurchase = async (id: string, value: string) => {
        for (const _item of ListsValue) {
            if (id === _item.id) {
                await purchase(id, { value: value });
                return;
            }
        }
    };

    const requestRegister = async () => {
        if (itemName === "" || itemPrice === "") {
            console.log("適切な情報を入力してください。");
            return;
        }
        await register(itemName, itemPrice);
    };

    return {
        listCount: listContValue,
        lists: ListsValue,
        requestPurchase,
        requestRegister,
        updateItemName,
        updateItemPrice,
    };
};

const Content: FC<ContentProps> = ({ contract }) => {
    const {
        lists,
        requestPurchase,
        requestRegister,
        updateItemName,
        updateItemPrice,
    } = useContent(contract);

    const handleRegister = async () => {
        await requestRegister();
        window.location.reload();
    };

    const handleRequestPurchase = async (id: string, value: string) => {
        await requestPurchase(id, value);
        window.location.reload();
    };

    return (
        <div>
            <div>
                <h2>Register Item</h2>
                <Box>
                    <TextField
                        id="filled-basic"
                        label="Name"
                        variant="filled"
                        onChange={updateItemName}
                    />
                    <TextField
                        id="filled-basic"
                        label="Price [wei]"
                        variant="filled"
                        onChange={updateItemPrice}
                    />
                    <Box>
                        <Button onClick={handleRegister}>Register</Button>
                    </Box>
                </Box>
            </div>
            <h2>Item List</h2>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Price [wei]</th>
                        <th>Seller</th>
                    </tr>
                </thead>
                <tbody>
                    {lists.map((t, index) => (
                        <tr key={`task.${index}`}>
                            <td>{t.id}</td>
                            <td>{t.name}</td>
                            <td>{t.price.toString()}</td>
                            <td>{t.seller}</td>
                            <td>
                                <Button
                                    variant="contained"
                                    onClick={() =>
                                        handleRequestPurchase(
                                            t.id,
                                            t.price.toString()
                                        )
                                    }
                                >
                                    Purchase
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const contractAddress = config.contract_address || "";
console.log("contractAddress", contractAddress);

function App() {
    const [signer, setSigner] = useState<ethers.providers.JsonRpcSigner>();

    // const provider = new ethers.providers.JsonRpcProvider();
    // const provider = new ethers.providers.JsonRpcProvider(
    //     "http://localhost:8545"
    // );
    const provider = new ethers.providers.Web3Provider(
        (window as any).ethereum,
        "any"
    );

    useEffect(() => {
        const authMetamask = async () => {
            await provider.send("eth_requestAccounts", []);
            const _signer = provider.getSigner();
            if (_signer) {
                setSigner(_signer);
            } else {
                console.error("undefiend signer");
            }
        };
        authMetamask();
    }, []);

    const contract: ethers.Contract = new ethers.Contract(
        contractAddress,
        artifact.abi,
        provider
    );
    console.log("signer", signer);
    if (!signer) {
        return <div>Loading...</div>;
    }
    const contractWithSigner = contract.connect(signer);

    return (
        <div>
            <h1>Market Place</h1>
            {/* ここでアカウントを使った処理をする */}
            <Header
                signer={signer}
                provider={provider}
                contract={contractWithSigner}
            />

            {/* <Content contract={contract} /> */}
            <Content contract={contractWithSigner} />
        </div>
    );
}

export default App;
