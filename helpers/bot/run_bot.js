const bot = require('node-autoit-koffi');

require('dotenv').config();

const fp_win_title = process.env.FP_WIN_TITLE || 'Aplikasi Registrasi Sidik Jari';
const frista_win_title = process.env.FRISTA_WIN_TITLE || 'Login Frista (Face Recognition BPJS Kesehatan)';
const fp_ins_path = process.env.FP_INS_PATH || 'C:\\Program Files (x86)\\BPJS Kesehatan\\Aplikasi Sidik Jari BPJS Kesehatan\\After.exe';
const frista_ins_path = process.env.FRISTA_INS_PATH || 'C:\\Program Files (x86)\\Frista\\frista.exe';

function delay(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

module.exports = async function run_bot({app_name, username, password, card_number, exit, wait }) {
            // open or activate the application window

            console.log(app_name, username, password, card_number, exit, wait)
            const win_title = (app_name === 'fingerprint') ? fp_win_title : frista_win_title;
            const ins_path = (app_name === 'fingerprint') ? fp_ins_path : frista_ins_path;

            const already_open = await bot.winExists(win_title);
            if (!already_open) {
                await bot.run(ins_path);
                await bot.winWait(win_title); // wait for the application window to appear
            }

            await bot.winActivate(win_title); // activate the application window
            await bot.winWaitActive(win_title); // wait for the application to be in focus

            if (exit) {
                await bot.winSetOnTop(win_title, '', 1); // set window on top
            }

            // get the position and size of the window
            const win_pos = await bot.winGetPos(win_title);
            if (!win_pos) throw new Error('Failed to get window position');

            // use top and left positions to calculate absolute points
            const { top, left, right, bottom} = win_pos;
            const width = right - left;
            const height = bottom - top;

            const alreadyOpenX = (app_name === 'fingerprint') ? (left + 223) : (left + Math.floor(width * 0.5));
            const alreadyOpenY = (app_name === 'fingerprint') ? (top + 121) : (top + Math.floor(height * 0.35));
            
            const usernameX = (app_name === 'fingerprint') ? (left + 223) : (left + Math.floor(width * 0.5));
            const usernameY = (app_name === 'fingerprint') ? (top + 179) : (top + Math.floor(height * 0.35))

            // login if window just open up
            if (already_open) {
                // focus number input
                await bot.mouseMove(alreadyOpenX, alreadyOpenY, 0);
                await bot.mouseClick('left');

                // clear number input
                await bot.send('^a');
                await bot.send('{BACKSPACE}');
            } else {
                // focus to the first input
                await bot.mouseMove(usernameX, usernameY, 0);
                await bot.mouseClick('left');

                await delay(1000);

                // clear and enter the username
                await bot.send('^a');
                await bot.send('{BACKSPACE}');
                await bot.send(username);

                await bot.send('{TAB}');

                // clear and enter the password
                //await bot.send('^a');
                //await bot.send('{BACKSPACE}');
                await bot.send(password);

                // hit enter key for login
                await bot.send('{ENTER}');

                await delay(+wait || 3_593);
            }
            //await bot.send(card_number);

            if (exit) {
                // wait for window to close
                await bot.winWaitClose(win_title);
            }
}