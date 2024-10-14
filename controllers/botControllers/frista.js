const run_bot = require('../../helpers/bot/run_bot.js');

module.exports = async function frista(req, res) {

    try {
        const app_name = 'frista';

        const {username = '', password = '', card_number = '', exit = true, wait = 2000} = req.body;

        if (!username || !password || !card_number) {
            return res.status(400).json({
                message: 'Username, password, dan nomor kartu harus diisi'
            })
        }

        await run_bot({app_name, username, password, card_number, exit, wait});
        return res.status(200).json({ message: 'Success' });

    } catch(err) {
        console.log(err)
        return res.status(500).json({
            message: err?.message || 'Internal error'
        });
    }

}