

// await / async Error handling 

async function wrapAwait(promise){

    try {
        const result = await promise;
        return [result,null];
    } catch (error) {
        return [null,error];
    }

}



module.exports = {wrapAwait}
