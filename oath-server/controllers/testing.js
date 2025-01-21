
exports.ok = (req, res) => {
    res.send("Ok")
}

const isPrime = (num) => {
    let flag = true;
    if (num == 1) {
        flag = false;
    }
    if (num != 2) {
        let c = 1;
        for (let index = 2; index <= num; index++) {
            if (num % index == 0) {
                c++;
            }
        }
        if (c > 1) {
            flag = false
        }
    }
    return flag;
}

const primes = (times) => {
    return new Promise((resolve, reject)=>{
        for (let index = times - 999; index <= times; index++) {
            console.log(isPrime(index));
        }
        resolve(true);
    })
    
}

exports.primes = (req, res) => {
    let totalSize = 10000000000000
    const batchSize = 1000;
    const batches = totalSize / batchSize;
    for (let i = 1; i <= batches; i++ ) {
        primes(batchSize * i).then((d)=>{
            console.log("Hello Date -----> ", d);
        });
    }
    res.send("Madorchod running...")
}