import '@nomicfoundation/hardhat-toolbox';
import 'dotenv/config';

import { HardhatUserConfig } from 'hardhat/config';

// 下記がないとコンパイル出来ない
const config: HardhatUserConfig = {
    solidity: "0.8.17",
};

export default config;
