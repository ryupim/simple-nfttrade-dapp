import { ethers } from 'ethers';
import React, { FC, useEffect, useState } from 'react';

type HeaderProps = {
    signer: ethers.providers.JsonRpcSigner;
    provider: ethers.providers.JsonRpcProvider;
};

const Header: FC<HeaderProps> = ({ signer, provider }) => {
    const [address, setAddress] = useState<string>("");
    const [balance, setBalance] = useState<number>(0);
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        signer
            .getAddress()
            .then((data) => {
                setAddress(data);
                provider.getBalance(data).then((data) => {
                    const balanceInEth = ethers.utils.formatEther(data);
                    console.log(balanceInEth);
                    setBalance(Number(balanceInEth));
                });

                setLoading(false);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    // const balanceInEth = ethers.utils.formatEther(Number(balance));

    return (
        <>
            <div>{`Account: ${address}`}</div>
            <div>{`Balance: ${balance} ETH`}</div>
        </>
    );
};

export default Header;
