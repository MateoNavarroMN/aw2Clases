import os from 'node:os';

// console.log(os.cpus())
// console.log(os.totalmem()/1024/1024/1024)
console.log(os.totalmem() - os.freemem())

