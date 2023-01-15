import './App.css';

import { ethers } from 'ethers';
import React, { FC, useEffect, useState } from 'react';

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
    const { listings, ListingCount } = contract.functions;
    const [listContValue, setListCountValue] = useState<string>("");
    const [ListsValue, setListsValue] = useState<List[]>([]);

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

    return {
        listCount: listContValue,
        lists: ListsValue,
        // updateTaskContent,
        // requestCreateTask,
        // requestToggleIsCompleted,
    };
};

const Content: FC<ContentProps> = ({ contract }) => {
    const { listCount, lists } = useContent(contract);

    // const handleCreateTask = async () => {
    //     await requestCreateTask();
    //     window.location.reload();
    // };

    // const handleToggleIsCompleted = async (id: string) => {
    //     await requestToggleIsCompleted(id);
    //     window.location.reload();
    // };

    return (
        <div>
            {/* <p>
                <input onChange={updateTaskContent} />
                <button onClick={handleCreateTask}>Create Task</button>
            </p> */}
            <div>{`listCount... ${listCount}`}</div>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Seller</th>
                    </tr>
                </thead>
                <tbody>
                    {lists.map((t, index) => (
                        <tr key={`task.${index}`}>
                            <td>{t.id}</td>
                            <td>{t.name}</td>
                            <td>{Number(t.price)}</td>
                            <td>{t.seller}</td>

                            {/* <td>
                                <button
                                    onClick={() =>
                                        handleToggleIsCompleted(t.id)
                                    }
                                >
                                    Change
                                </button>
                            </td> */}
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
    const provider = new ethers.providers.JsonRpcProvider();
    // const provider = new ethers.providers.JsonRpcProvider(
    //     "http://localhost:7545"
    // );
    const signer = provider.getSigner();

    const contract: ethers.Contract = new ethers.Contract(
        contractAddress,
        artifact.abi,
        provider
    );
    const contractWithSigner = contract.connect(signer);

    return (
        <div>
            <h1>Market Place</h1>
            {/* ここでアカウントを使った処理をする */}
            <Header signer={signer} provider={provider} />

            {/* <Content contract={contract} /> */}
            <Content contract={contractWithSigner} />
        </div>
    );
}

export default App;
