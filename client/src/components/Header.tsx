import { ethers } from 'ethers';
import React, { FC, useEffect, useState } from 'react';

type HeaderProps = {
    signer: ethers.providers.JsonRpcSigner;
    provider: ethers.providers.JsonRpcProvider;
    contract: ethers.Contract;
};

const Header: FC<HeaderProps> = ({ signer, provider, contract }) => {
    const { balances, withdraw } = contract.functions;

    const [address, setAddress] = useState<string>("");
    const [balance, setBalance] = useState<number>(0);
    const [deposit, setDeposit] = useState<number>(0);
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        async function getDeposit() {
            const _deposit = await balances(address).catch((err) => {
                console.error(err);
            });
            setDeposit(_deposit);
        }
        signer
            .getAddress()
            .then((data) => {
                setAddress(data);
                provider.getBalance(data).then((data) => {
                    const balanceInEth = ethers.utils.formatEther(data);
                    setBalance(Number(balanceInEth));
                });

                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
            });

        getDeposit();
    }, [address]);

    const handleRequestWithdraw = async () => {
        await withdraw();
        window.location.reload();
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    // const balanceInEth = ethers.utils.formatEther(Number(balance));

    return (
        <>
            <div>{`Account: ${address}`}</div>
            <div>{`Balance: ${balance} ETH`}</div>
            <div>
                <p>{`Deposit: ${deposit} ETH`}</p>
                <button onClick={handleRequestWithdraw}>Withdraw</button>
            </div>
        </>
    );
};

export default Header;
