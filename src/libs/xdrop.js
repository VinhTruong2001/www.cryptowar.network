export const AirdropLander = {
    address: process.env.VUE_APP_AIRDROPV2_CONTRACT_ADDRESS || '0xFE2B53904851C97e4a5d52DB69Abbdd526Fe6004',
    // jsonInterface: require('@/assets/contracts/AirdropLander.json')
    jsonInterface: require('@/assets/contracts/XDrop.json')
}

const GasLimit = 800000;
export const getAirdropContract = async (web3Client) => {
    const accounts = await web3Client.eth.getAccounts();
    return new web3Client.eth.Contract(
        AirdropLander.jsonInterface.abi,
        AirdropLander.address,
        {
            gas: GasLimit,
            from: accounts[0]
        }
    );
}


export const claimAirdrop = async (web3Client, address, amount, ref) => {
    const contract = await getAirdropContract(web3Client);

    // const value = (Math.floor(Math.random() * Math.floor(12)) + 5) / 1000;
    let _gasLimit = GasLimit;
    try {
        _gasLimit = await contract.methods.distributeTokens(address,ref).estimateGas({value: web3Client.utils.toWei(amount.toString(), 'ether'),gas: GasLimit*10});
    } catch(er){

        // eslint-disable-next-line no-console
        console.error(er);

    }
    if (_gasLimit < GasLimit ){
        _gasLimit = GasLimit;
    }

    await contract.methods.distributeTokens(address,ref).send({
        value: web3Client.utils.toWei(amount.toString(), 'ether'),
        gas: _gasLimit  | 0
    });
}

// export const adjustParams = async (web3Client) => {
//     const contract = await getAirdropContract(web3Client);
//     await contract.methods.setClaimableAmount(888).send();
//     await contract.methods.setNextPeriodWaitTime(60 * 60 * 24).send();
// }

export const getReturnAmount = async (web3Client, tokenAddress='0x27a339d9b59b21390d7209b78a839868e319301b', amount) => {
    // const accounts = await web3Client.eth.getAccounts();

    amount = web3Client.utils.toWei(amount.toString(), 'ether')
    const contract = await getAirdropContract(web3Client);
    let result = await contract.methods.getReturnAmount(amount,tokenAddress).call();
    // eslint-disable-next-line no-debugger
    // debugger;
    console.log(`result ${result}`)
    result = Math.round(web3Client.utils.fromWei(result.toString(), 'ether'));
    return result;
}
