import express from 'express';

const router = express.Router();

router.post('/api/users/signin', (req, res) => {
    res.send('Hiiii signin');
});

export {router as signinRouter};