import '@nomicfoundation/hardhat-toolbox';
import 'dotenv/config';

import { HardhatUserConfig } from 'hardhat/config';

// const config: HardhatUserConfig = {
//     solidity: "0.8.17",
// };

// export default config;

module.exports = {
    solidity: "0.8.17",
    networks: {
        gethnet: {
            url: process.env.PROVIDER_URL,
            accounts: [`0x${process.env.PRIVATE_KEY}`],
        },
    },
};
