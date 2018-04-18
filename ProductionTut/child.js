let count = 1;

// const inc = () => {
//     console.log(`${count++}`);
// };

const inc = () => {
    process.send(`${count++}`);
};

setInterval(inc, 500);