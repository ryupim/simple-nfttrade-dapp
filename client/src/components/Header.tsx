import { ethers } from 'ethers';
import { FC } from 'react';

type HeaderProps = {
    signer: ethers.providers.JsonRpcSigner;
};

const Header: FC<HeaderProps> = ({ signer }) => {
    signer.getAddress().then((data) => {
        console.log(data);
        return <div>${data}</div>;
    });

    console.log("address");

    return <div>test</div>;
};

export default Header;
