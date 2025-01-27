const express = require('express');
const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;

let totalBudget = 500;
const envelopes = {
    1: {
        name: 'Rent',
        budget: 200,
    },
    2: {
        name: 'Shopping',
        budget: 100,
    },
    3: {
        name: 'Petrol',
        budget: 50,
    },
    4: {
        name: 'Activies',
        budget: 100,
    },
    5: {
        name: 'savings',
        budget: 50,
    }
};

app.get('/',(req, res, next) =>{
    res.status(200).send('Hello World')
});

app.post('/envelopes', (req, res, next) => {
    const { name, budget } = req.body;
    if (!name || !budget) {
        return res.status(400).send('Name and budget are required');
    }
    const id = Object.keys(envelopes).length + 1;
    totalBudget += budget;
    envelopes[id] = { name, budget };
    res.status(200).send(envelopes[id]);
});

app.get('/envelopes', (req, res, next) => {
    res.status(200).send(envelopes);
});

app.get('/envelopes/:id', (req, res, next) => {
    const envelope = envelopes[req.params.id];
    if (!envelope) {
        return res.status(404).send('Envelope not found');
    }
    res.status(200).send(envelope);
});

app.put('/envelopes/:id', (req, res, next) => {
    const envelope = envelopes[req.params.id];
    if (!envelope) {
        return res.status(404).send('Envelope not found');
    }
    const { name, budget } = req.body;
    if (name) {
        envelope.name = name;
    }
    if(budget) {
        const currentBudget = totalDeducted();
        const diff = envelope.budget - budget;
        if(diff + currentBudget > totalBudget) {
            return res.status(400).send('Not enough funds');
        } else {
            envelope.budget = budget;
        }
    }
    envelopes[req.params.id] = envelope;
    res.status(200).send(envelopes[req.params.id]);
});

app.delete('/envelopes/:id', (req, res, next) => {
    const envelope = envelopes[req.params.id];
    if (!envelope) {
        return res.status(404).send('Envelope not found');
    }
    totalBudget -= envelope.budget;
    delete envelopes[req.params.id];
    res.status(200).send('Envelope deleted');
});

app.put('/envelopes/transfer/:from/:to/:amount', (req, res, next) => {
    const from = envelopes[req.params.from];
    const to = envelopes[req.params.to];
    const amount = Number(req.params.amount);
    if(!from || !to){
        return res.status(404).send('At least one of the envelopes not found');
    }
    if(from.budget < amount){
        return res.status(404).send(`not enough money in ${from} to add to ${to}`);
    }
    from.budget -= amount;
    to.budget += amount;
    res.status(200).send(envelopes);
});

const totalDeducted = () => {
    let total = 0;
    for (const key in envelopes) {
        total += envelopes[key].budget;
    }
    return total;
};

app.listen(PORT, () => {
  console.log("server is running on port", PORT);
});