//This is just an example on promises

const sleep = (ms: number) => {
    return new Promise((onFulfill, onReject) => {
        setTimeout(()=> onFulfill('elapsed '+ ms), ms);
    })
}



const main = async () => {
    const p1 = sleep(1000);
    const p2 = sleep(2000);
    const result = await Promise.all([p1, p2])
    console.log(result);
    
}

main();

export{};

//npm run ts-node -- .\src\promises.ts